import { callTool } from "./mcp-client.js";

interface ReelOptions {
  product: string;
  imageUrl?: string;
  duration: number;
  aspect: "16:9" | "9:16" | "1:1";
}

interface JobResult {
  status: "pending" | "queued" | "running" | "succeeded" | "failed";
  outputUrl?: string;
  error?: string;
}

export async function generateReel(opts: ReelOptions): Promise<void> {
  const { product, imageUrl, duration, aspect } = opts;

  console.log("[1/5] Refreshing skills...");
  await callTool("refresh_skills", {}).catch(() => {
    console.warn("  refresh_skills failed — continuing with cached schema");
  });

  console.log("[2/5] Selecting best model...");
  const suggestion = await callTool<{ modelId: string; reasoning: string }>(
    "suggest_model",
    { description: `Product motion reel: ${product}` },
  );
  console.log(`  Model: ${suggestion.modelId} — ${suggestion.reasoning}`);

  console.log("[3/5] Creating project...");
  const { project_id } = await callTool<{ project_id: string }>("create_project", {
    title: `Reel: ${product.slice(0, 60)}`,
  });

  let referenceImageUrl = imageUrl;
  if (!referenceImageUrl) {
    console.log("  No image provided — generating reference candidates...");
    const refs = await callTool<{ images: { url: string }[] }>("pick_reference_images", {
      description: product,
    });
    referenceImageUrl = refs.images?.[0]?.url;
    if (!referenceImageUrl) throw new Error("pick_reference_images returned no images");
    console.log(`  Using auto-selected reference: ${referenceImageUrl}`);
  }

  console.log("[4/5] Submitting video render...");
  const { jobId } = await callTool<{ jobId: string }>("generate_video", {
    project_id,
    shot_index: 0,
    modelId: suggestion.modelId,
    prompt: `Cinematic product reveal: ${product}. Professional lighting, smooth motion, ${aspect} aspect ratio.`,
    durationSec: duration,
    aspectRatio: aspect,
    reference_image_url: referenceImageUrl,
  });

  console.log(`  Job submitted: ${jobId}. Polling...`);
  const outputUrl = await pollJob(jobId);
  console.log(`[5/5] Done — video ready: ${outputUrl}`);
}

async function pollJob(jobId: string, maxWaitMs = 600_000): Promise<string> {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    await sleep(10_000);
    const job = await callTool<JobResult>("get_job", { jobId });
    if (job.status === "succeeded") {
      if (!job.outputUrl) throw new Error(`job ${jobId} succeeded but no outputUrl`);
      return job.outputUrl;
    }
    if (job.status === "failed") {
      throw new Error(`job ${jobId} failed: ${job.error ?? "unknown"}`);
    }
    process.stdout.write(".");
  }
  throw new Error(`job ${jobId} timed out`);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
