import "dotenv/config";
import fetch from "node-fetch";

interface VideoModel {
  id: string;
  name: string;
  quality: "low" | "medium" | "high" | "ultra";
  speedRating: "slow" | "medium" | "fast";
  costPerVideo: number;
  bestFor: string;
}

interface GenerationResult {
  modelId: string;
  modelName: string;
  jobId: string;
  prompt: string;
  durationSec: number;
  status: "queued" | "rendering" | "succeeded" | "failed";
  outputUrl?: string;
  renderTimeMs?: number;
  estimatedCost: number;
  errorMessage?: string;
}

interface ComparisonReport {
  prompt: string;
  durationSec: number;
  results: GenerationResult[];
  totalTimeMs: number;
  cheapest: GenerationResult;
  fastest: GenerationResult;
  bestQuality: GenerationResult;
}

// Model catalog with pricing and capabilities
const MODELS: Record<string, VideoModel> = {
  "kling-1": {
    id: "kling-1",
    name: "Kling 1.0",
    quality: "ultra",
    speedRating: "slow",
    costPerVideo: 0.50,
    bestFor: "Premium product videos, high-end commercials, hero shots"
  },
  "veo-2": {
    id: "veo-2",
    name: "Veo 2",
    quality: "high",
    speedRating: "medium",
    costPerVideo: 0.35,
    bestFor: "Fast turnaround, cost-effective, good quality for most use cases"
  },
  "runway-gen-4": {
    id: "runway-gen-4",
    name: "Runway Gen-4",
    quality: "medium",
    speedRating: "fast",
    costPerVideo: 0.20,
    bestFor: "Rapid prototyping, budget-conscious, experimental"
  }
};

class VarosityClient {
  private apiKey: string;
  private apiBase = "https://api.varosity.ai";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("VAROSITY_API_KEY is required. Get one at https://varosity.ai/app/keys/api-keys");
    }
    this.apiKey = apiKey;
  }

  async generateVideo(
    prompt: string,
    durationSec: number,
    modelId: string,
    aspectRatio: string = "16:9"
  ): Promise<string> {
    const body = {
      prompt,
      durationSec,
      aspectRatio,
      modelId
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

  async getJobStatus(jobId: string): Promise<any> {
    const response = await fetch(`${this.apiBase}/v1/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get job status: ${response.statusText}`);
    }

    return await response.json();
  }

  async waitForCompletion(jobId: string, maxWaitMs = 300000): Promise<any> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < maxWaitMs) {
      const job = await this.getJobStatus(jobId);

      if (job.status === "succeeded" || job.status === "failed") {
        return {
          ...job,
          renderTimeMs: Date.now() - startTime
        };
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Video generation timed out after ${maxWaitMs}ms`);
  }
}

async function compareModels(
  prompt: string,
  durationSec: number = 5,
  models: string[] = ["kling-1", "veo-2", "runway-gen-4"],
  aspectRatio: string = "16:9"
): Promise<ComparisonReport> {
  const apiKey = process.env.VAROSITY_API_KEY;
  if (!apiKey) {
    throw new Error("VAROSITY_API_KEY environment variable is not set");
  }

  const client = new VarosityClient(apiKey);

  console.log("🎬 Multi-Model Comparison Test\n");
  console.log(`Prompt: "${prompt}"`);
  console.log(`Duration: ${durationSec}s | Aspect: ${aspectRatio}\n`);

  // Step 1: Submit all jobs in parallel
  console.log("📤 Submitting jobs...\n");

  const jobPromises = models.map(async modelId => {
    const model = MODELS[modelId];
    if (!model) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    console.log(`  → ${model.name.padEnd(15)} (quality: ${model.quality}, speed: ${model.speedRating})`);

    const jobId = await client.generateVideo(prompt, durationSec, modelId, aspectRatio);
    console.log(`    Job ID: ${jobId}`);

    return { modelId, jobId };
  });

  const submittedJobs = await Promise.all(jobPromises);
  console.log("\n⏳ Rendering 3 videos in parallel...\n");

  // Step 2: Wait for all jobs to complete
  const startTime = Date.now();
  const results: GenerationResult[] = [];

  for (const { modelId, jobId } of submittedJobs) {
    const model = MODELS[modelId];
    console.log(`  ⏳ ${model.name}...`);

    const job = await client.waitForCompletion(jobId);

    const result: GenerationResult = {
      modelId,
      modelName: model.name,
      jobId,
      prompt,
      durationSec,
      status: job.status,
      outputUrl: job.outputUrl,
      renderTimeMs: job.renderTimeMs,
      estimatedCost: (durationSec / 5) * model.costPerVideo,
      errorMessage: job.error
    };

    results.push(result);
    console.log(`     ✓ Complete in ${(job.renderTimeMs / 1000).toFixed(1)}s`);
  }

  const totalTimeMs = Date.now() - startTime;

  // Step 3: Generate comparison report
  const report: ComparisonReport = {
    prompt,
    durationSec,
    results,
    totalTimeMs,
    cheapest: results.reduce((a, b) => (a.estimatedCost < b.estimatedCost ? a : b)),
    fastest: results.reduce((a, b) => ((a.renderTimeMs ?? 0) < (b.renderTimeMs ?? 0) ? a : b)),
    bestQuality: results[0] // Kling is always first and best quality
  };

  return report;
}

function printReport(report: ComparisonReport): void {
  console.log("\n✅ Comparison Complete!\n");

  console.log("📊 RESULTS TABLE\n");

  const table = report.results.map(r => ({
    Model: r.modelName,
    "Render Time": `${(r.renderTimeMs! / 1000).toFixed(1)}s`,
    "Cost/Video": `$${r.estimatedCost.toFixed(2)}`,
    Status: r.status === "succeeded" ? "✓" : "✗",
    URL: r.outputUrl?.substring(0, 40) + "..." || "N/A"
  }));

  console.table(table);

  console.log("\n🏆 WINNERS\n");
  console.log(`  Highest Quality: ${report.bestQuality.modelName} (Ultra HD)`);
  console.log(`  Fastest: ${report.fastest.modelName} (${(report.fastest.renderTimeMs! / 1000).toFixed(1)}s)`);
  console.log(`  Cheapest: ${report.cheapest.modelName} ($${report.cheapest.estimatedCost.toFixed(2)})`);

  console.log("\n💡 RECOMMENDATION\n");

  if (report.cheapest.modelId === report.fastest.modelId) {
    console.log(
      `  → Use ${report.fastest.modelName} for best value (fast AND cheap)\n`
    );
  } else {
    console.log(`  → For budget: ${report.cheapest.modelName} ($${report.cheapest.estimatedCost.toFixed(2)})`);
    console.log(`  → For speed: ${report.fastest.modelName} (${(report.fastest.renderTimeMs! / 1000).toFixed(1)}s)`);
    console.log(`  → For quality: ${report.bestQuality.modelName} (premium)\n`);
  }

  console.log("📈 QUALITY MATRIX\n");
  console.log("  Kling 1.0  : ⭐⭐⭐⭐⭐ Ultra HD, perfect for hero shots");
  console.log("  Veo 2      : ⭐⭐⭐⭐ Great for most use cases, best value");
  console.log("  Runway Gen-4: ⭐⭐⭐ Good for prototyping, experimental\n");

  console.log("🔗 Watch Generated Videos\n");
  report.results.forEach(r => {
    if (r.outputUrl) {
      console.log(`  ${r.modelName.padEnd(15)} → ${r.outputUrl}`);
    }
  });
}

async function main() {
  const args = process.argv.slice(2);

  let prompt = "A sleek modern wireless headphone, premium packaging, product shot, studio lighting";
  let durationSec = 5;
  let models: string[] = ["kling-1", "veo-2", "runway-gen-4"];
  let aspectRatio = "16:9";

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--prompt" || args[i] === "-p") && args[i + 1]) {
      prompt = args[++i];
    } else if ((args[i] === "--duration" || args[i] === "-d") && args[i + 1]) {
      durationSec = parseInt(args[++i], 10);
    } else if ((args[i] === "--models" || args[i] === "-m") && args[i + 1]) {
      models = args[++i].split(",").map(m => m.trim());
    } else if (args[i] === "--aspect" && args[i + 1]) {
      aspectRatio = args[++i];
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Multi-Model Comparison Tool

Usage: npm run compare -- [options]

Options:
  --prompt, -p <text>     Video prompt (default: headphone example)
  --duration, -d <sec>    Video duration in seconds (default: 5)
  --models, -m <list>     Comma-separated models (default: kling-1,veo-2,runway-gen-4)
                         Available: kling-1, veo-2, runway-gen-4
  --aspect <ratio>        Aspect ratio (default: 16:9)
                         Options: 16:9, 9:16, 1:1, 4:5, 21:9
  --help, -h              Show this help

Examples:

  # Default comparison (all 3 models)
  npm run compare

  # Custom product with faster models
  npm run compare -- --prompt "Luxury watch, gold, elegant" --duration 3 --models veo-2,runway-gen-4

  # Compare only expensive models for hero shot
  npm run compare -- --prompt "Hero shot: sports car in sunset" --duration 8 --models kling-1,veo-2

  # Short-form vertical video
  npm run compare -- --aspect 9:16 --prompt "TikTok style dance video"

Pricing:
  Kling 1.0    : $0.50 per 5s video
  Veo 2        : $0.35 per 5s video
  Runway Gen-4 : $0.20 per 5s video
`);
      process.exit(0);
    }
  }

  // Validate models
  for (const m of models) {
    if (!MODELS[m]) {
      console.error(`❌ Unknown model: ${m}`);
      console.error(`Available models: ${Object.keys(MODELS).join(", ")}`);
      process.exit(1);
    }
  }

  try {
    const report = await compareModels(prompt, durationSec, models, aspectRatio);
    printReport(report);
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
