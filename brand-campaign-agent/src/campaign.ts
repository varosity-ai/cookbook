import { callTool } from "./mcp-client.js";

interface Shot {
  index: number;
  prompt: string;
  durationSec: number;
  aspectRatio: "16:9" | "9:16" | "1:1";
}

interface StoryboardResult {
  shots: Shot[];
  project_id?: string;
}

interface JobResult {
  status: "pending" | "queued" | "running" | "succeeded" | "failed";
  outputUrl?: string;
  error?: string;
}

export async function runCampaign(brief: string): Promise<void> {
  console.log("[1/6] Refreshing skills...");
  await callTool("refresh_skills", {}).catch(() => {
    console.warn("  refresh_skills failed — continuing with cached skill");
  });

  console.log("[2/6] Planning storyboard...");
  const storyboard = await callTool<StoryboardResult>("plan_storyboard", {
    brief,
    shotCount: 3,
  });
  const shots: Shot[] = storyboard.shots ?? [];
  console.log(`  ${shots.length} shots planned`);

  console.log("[3/6] Creating project...");
  const { project_id } = await callTool<{ project_id: string }>("create_project", {
    title: `Campaign: ${brief.slice(0, 50)}`,
  });

  const outputUrls: string[] = [];

  for (const shot of shots) {
    console.log(`[4/6] Shot ${shot.index + 1}/${shots.length}: selecting reference image...`);
    const refs = await callTool<{ images: { url: string }[] }>("pick_reference_images", {
      description: shot.prompt,
    });
    const referenceImageUrl = refs.images?.[0]?.url;
    if (!referenceImageUrl) throw new Error("pick_reference_images returned no images");

    console.log(`  Submitting render for shot ${shot.index + 1}...`);
    const { jobId } = await callTool<{ jobId: string }>("generate_video", {
      project_id,
      shot_index: shot.index,
      prompt: shot.prompt,
      durationSec: shot.durationSec,
      aspectRatio: shot.aspectRatio,
      reference_image_url: referenceImageUrl,
    });

    console.log(`  Polling job ${jobId}...`);
    const outputUrl = await pollJob(jobId);
    outputUrls.push(outputUrl);
    console.log(`  Shot ${shot.index + 1} ready: ${outputUrl}`);
  }

  console.log("[5/6] Stitching project...");
  const renderResult = await callTool<{ outputUrl?: string; error?: string }>(
    "render_project",
    { projectId: project_id },
  ).catch((err: Error) => ({ outputUrl: undefined, error: err.message }));

  if (renderResult.outputUrl) {
    console.log(`[6/6] Done — final video: ${renderResult.outputUrl}`);
  } else {
    console.log(
      "[6/6] render_project unavailable — individual shot URLs:",
      outputUrls,
    );
    console.log(
      "  Run ffmpeg to concat:\n" +
        outputUrls.map((u, i) => `  echo "file 'shot${i}.mp4'" >> concat.txt`).join("\n") +
        "\n  ffmpeg -f concat -safe 0 -i concat.txt -c copy final.mp4",
    );
  }
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
      throw new Error(`job ${jobId} failed: ${job.error ?? "unknown error"}`);
    }
    process.stdout.write(".");
  }
  throw new Error(`job ${jobId} did not complete within ${maxWaitMs / 1000}s`);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
