import { callTool } from "./mcp-client.js";

interface NewsShortOptions {
  headline: string;
  body: string;
}

interface Shot {
  index: number;
  prompt: string;
  durationSec: number;
}

interface JobResult {
  status: "pending" | "queued" | "running" | "succeeded" | "failed";
  outputUrl?: string;
  error?: string;
}

export async function newsToShort(opts: NewsShortOptions): Promise<void> {
  const { headline, body } = opts;

  console.log("[1/6] Refreshing skills...");
  await callTool("refresh_skills", {}).catch(() => {
    console.warn("  refresh_skills failed — continuing with cached schema");
  });

  console.log("[2/6] Planning storyboard from news brief...");
  const storyboard = await callTool<{ shots: Shot[] }>("plan_storyboard", {
    brief: `News short: "${headline}"\n\n${body}`,
    shotCount: 4,
  });
  const shots: Shot[] = storyboard.shots ?? [];
  console.log(`  ${shots.length} shots planned`);

  console.log("[3/6] Creating project...");
  const { project_id } = await callTool<{ project_id: string }>("create_project", {
    title: headline.slice(0, 80),
  });

  // Submit all video jobs in parallel
  console.log("[4/6] Submitting video renders (parallel)...");
  const jobIds = await Promise.all(
    shots.map(async (shot) => {
      const refs = await callTool<{ images: { url: string }[] }>("pick_reference_images", {
        description: shot.prompt,
      });
      const referenceImageUrl = refs.images?.[0]?.url;
      if (!referenceImageUrl) throw new Error("pick_reference_images returned no images");

      const { jobId } = await callTool<{ jobId: string }>("generate_video", {
        project_id,
        shot_index: shot.index,
        prompt: shot.prompt,
        durationSec: shot.durationSec,
        aspectRatio: "9:16",
        reference_image_url: referenceImageUrl,
      });
      return jobId;
    }),
  );
  console.log(`  ${jobIds.length} jobs submitted`);

  // Submit voiceover in parallel with video jobs
  console.log("[5/6] Generating voiceover...");
  const voicePromise = callTool<{ outputUrl: string }>("generate_voice", {
    text: `${headline}. ${body.slice(0, 500)}`,
    modelId: "eleven-multilingual-v2",
    voiceId: process.env.VOICE_ID,
  });

  // Poll all video jobs + voiceover in parallel
  const [videoUrls, voiceResult] = await Promise.all([
    Promise.all(jobIds.map(pollJob)),
    voicePromise.catch((err: Error) => {
      console.warn(`  voiceover failed: ${err.message}`);
      return { outputUrl: undefined };
    }),
  ]);

  console.log("[6/6] Assets ready:");
  videoUrls.forEach((url, i) => console.log(`  Shot ${i + 1}: ${url}`));
  if (voiceResult.outputUrl) console.log(`  Voiceover: ${voiceResult.outputUrl}`);

  console.log(
    "\nAssemble with ffmpeg:\n" +
      videoUrls.map((_, i) => `  echo "file 'shot${i}.mp4'" >> concat.txt`).join("\n") +
      "\n  ffmpeg -f concat -safe 0 -i concat.txt -i voice.mp3 -shortest -c:v copy final.mp4",
  );
}

async function pollJob(jobId: string, maxWaitMs = 600_000): Promise<string> {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    await sleep(10_000);
    const job = await callTool<JobResult>("get_job", { jobId });
    if (job.status === "succeeded") {
      if (!job.outputUrl) throw new Error(`job ${jobId} succeeded with no outputUrl`);
      return job.outputUrl;
    }
    if (job.status === "failed") {
      throw new Error(`job ${jobId} failed: ${job.error ?? "unknown"}`);
    }
  }
  throw new Error(`job ${jobId} timed out`);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
