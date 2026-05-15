import "dotenv/config";
import fetch from "node-fetch";

interface VideoGenerationRequest {
  prompt: string;
  durationSec: number;
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:5" | "21:9";
  modelId?: string;
}

interface GeneratedVideo {
  jobId: string;
  promptUsed: string;
  aspectRatio: string;
  durationSec: number;
  status: "queued" | "rendering" | "succeeded" | "failed";
  outputUrl?: string;
  errorMessage?: string;
}

interface CarouselResult {
  videos: GeneratedVideo[];
  estimatedCost: number;
  totalRenderTime: number;
  success: boolean;
}

class VarosityClient {
  private apiKey: string;
  private apiBase = "https://api.varosity.ai";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("VAROSITY_API_KEY is required. Get one at https://varosity.ai/app/keys/api-keys");
    }
    this.apiKey = apiKey;
  }

  async generateVideo(params: VideoGenerationRequest): Promise<string> {
    const body = {
      prompt: params.prompt,
      durationSec: params.durationSec,
      aspectRatio: params.aspectRatio,
      modelId: params.modelId || "kling-1"
    };

    const response = await fetch(`${this.apiBase}/v1/video/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Video generation failed (${response.status}): ${error}`);
    }

    const data: any = await response.json();
    return data.jobId;
  }

  async getJobStatus(jobId: string): Promise<GeneratedVideo> {
    const response = await fetch(`${this.apiBase}/v1/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get job status: ${response.statusText}`);
    }

    const data: any = await response.json();

    return {
      jobId,
      promptUsed: data.prompt,
      aspectRatio: data.aspectRatio,
      durationSec: data.durationSec,
      status: data.status,
      outputUrl: data.outputUrl,
      errorMessage: data.error
    };
  }

  async waitForCompletion(jobId: string, maxWaitMs = 300000): Promise<GeneratedVideo> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < maxWaitMs) {
      const job = await this.getJobStatus(jobId);

      if (job.status === "succeeded") {
        return job;
      }

      if (job.status === "failed") {
        throw new Error(`Video generation failed: ${job.errorMessage}`);
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Video generation timed out after ${maxWaitMs}ms`);
  }
}

interface CarouselConfig {
  product: string;
  style?: string;
  brandColor?: string;
  duration?: number;
  modelId?: string;
  uploadS3?: boolean;
}

async function generateInstagramCarousel(config: CarouselConfig): Promise<CarouselResult> {
  const apiKey = process.env.VAROSITY_API_KEY;
  if (!apiKey) {
    throw new Error("VAROSITY_API_KEY environment variable is not set");
  }

  const client = new VarosityClient(apiKey);

  // Define the 5 carousel frames with different aspect ratios and purposes
  const frames = [
    {
      name: "hero-1-1",
      aspect: "1:1" as const,
      purpose: "hero",
      duration: config.duration || 5,
      prompt: `Hero shot of a ${config.product}. ${config.style || "modern, premium look"}. ${config.brandColor ? `Color: ${config.brandColor}` : ""}. High quality product photography, studio lighting, clean background.`
    },
    {
      name: "detail-4-5",
      aspect: "4:5" as const,
      purpose: "detail",
      duration: config.duration || 5,
      prompt: `Close-up detail shot of a ${config.product}. ${config.style || "modern, premium look"}. ${config.brandColor ? `Color: ${config.brandColor}` : ""}. Showcase materials and craftsmanship. Professional product photography.`
    },
    {
      name: "lifestyle-9-16",
      aspect: "9:16" as const,
      purpose: "lifestyle",
      duration: config.duration || 5,
      prompt: `Lifestyle shot: person using or wearing the ${config.product}. ${config.style || "modern, premium look"}}. ${config.brandColor ? `Color accent: ${config.brandColor}` : ""}. Natural lighting, real-world context, aspirational mood.`
    },
    {
      name: "unboxing-9-16",
      aspect: "9:16" as const,
      purpose: "unboxing",
      duration: config.duration || 8,
      prompt: `Unboxing video: hands revealing a ${config.product}. ${config.style || "modern, premium look"}}. ${config.brandColor ? `Color: ${config.brandColor}` : ""}. ASMR-style, premium packaging, slow reveal. Instagram Reel format.`
    },
    {
      name: "cta-1-1",
      aspect: "1:1" as const,
      purpose: "call-to-action",
      duration: 3,
      prompt: `Call-to-action shot: ${config.product} with text "Shop Now" or "Learn More". ${config.style || "modern, premium look"}}. ${config.brandColor ? `Color: ${config.brandColor}` : ""}. Bold, eye-catching, conversion-focused.`
    }
  ];

  console.log("🎬 Generating Instagram Carousel (5 videos)...\n");

  // Submit all jobs in parallel
  const jobIds = await Promise.all(
    frames.map(async frame => {
      console.log(`  📤 Submitting: ${frame.name} (${frame.aspect})...`);

      const jobId = await client.generateVideo({
        prompt: frame.prompt,
        durationSec: frame.duration,
        aspectRatio: frame.aspect,
        modelId: config.modelId
      });

      console.log(`     Job ID: ${jobId}`);
      return { jobId, frame };
    })
  );

  console.log("\n⏳ Waiting for videos to render...");

  // Poll for all jobs to complete
  const startTime = Date.now();
  const videos: GeneratedVideo[] = [];

  for (const { jobId, frame } of jobIds) {
    console.log(`  ⏳ Waiting for ${frame.name}...`);
    const video = await client.waitForCompletion(jobId);
    videos.push(video);
    console.log(`     ✓ Complete: ${video.outputUrl}`);
  }

  const renderTime = Date.now() - startTime;

  // Estimate cost (rough: $0.50 per 5-second video)
  const estimatedCost = videos.reduce((sum, v) => {
    return sum + (v.durationSec / 5) * 0.5;
  }, 0);

  console.log("\n✅ Carousel complete!\n");
  console.log("📊 Summary:");
  videos.forEach(v => {
    console.log(
      `  - ${v.aspectRatio.padEnd(6)} (${v.durationSec}s): ${v.outputUrl}`
    );
  });
  console.log(`\n  Total cost: $${estimatedCost.toFixed(2)}`);
  console.log(`  Render time: ${(renderTime / 1000).toFixed(1)}s\n`);

  return {
    videos,
    estimatedCost,
    totalRenderTime: renderTime,
    success: true
  };
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const config: CarouselConfig = {
    product: "luxury headphones",
    style: "premium, sleek, modern",
    brandColor: "deep black with gold accents",
    duration: 5,
    modelId: "kling-1"
  };

  // Simple argument parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--product" && args[i + 1]) {
      config.product = args[++i];
    } else if (args[i] === "--style" && args[i + 1]) {
      config.style = args[++i];
    } else if (args[i] === "--brand-color" && args[i + 1]) {
      config.brandColor = args[++i];
    } else if (args[i] === "--duration" && args[i + 1]) {
      config.duration = parseInt(args[++i], 10);
    } else if (args[i] === "--model" && args[i + 1]) {
      config.modelId = args[++i];
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Instagram Carousel Generator

Usage: npm run generate -- [options]

Options:
  --product <name>        Product to showcase (default: "luxury headphones")
  --style <style>         Visual style description (default: "premium, sleek, modern")
  --brand-color <color>   Brand color(s) (default: "deep black with gold accents")
  --duration <seconds>    Video duration (default: 5, unboxing: 8, CTA: 3)
  --model <model>         Video model to use (default: "kling-1")
                         Options: kling-1, veo-2, runway-gen-4
  --help                  Show this help message

Example:
  npm run generate -- --product "Luxury wireless headphones" --style "premium, minimal" --brand-color "blue"

Cost: Approximately $0.50 per 5-second video × 5 videos = $2.50
      Use --model veo-2 for faster, cheaper rendering

Requirements:
  - VAROSITY_API_KEY environment variable
  - Get one at https://varosity.ai/app/keys/api-keys
`);
      process.exit(0);
    }
  }

  try {
    const result = await generateInstagramCarousel(config);

    if (result.success) {
      console.log("📦 Ready to post!");
      console.log("  - All 5 videos are generated and ready");
      console.log("  - Use Postiz, Buffer, or native Instagram to schedule");
      console.log("  - Share on Instagram Reels, Feed, and Stories");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
