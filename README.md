# Varosity Cookbook

Runnable examples of Varosity agents and workflows. Each example is a complete, self-contained Node.js project. Copy `.env.example` → `.env`, add your `vsk_live_...` API key, and run.

---

## Quick Start

```bash
cd examples/brand-campaign-agent
cp .env.example .env
# Edit .env and add your VAROSITY_API_KEY

npm install
npm run campaign -- --brief "A 3-shot luxury product launch"
```

---

## Examples

### Core Examples (Production-Ready)

| Example | Purpose | Models |
|---------|---------|--------|
| **[brand-campaign-agent](./brand-campaign-agent/)** | Multi-shot storyboard → parallel renders → stitch | Kling + Veo |
| **[product-reel-generator](./product-reel-generator/)** | Single product shot + end card | Kling |
| **[news-to-shorts](./news-to-shorts/)** | News headline → 9:16 voiced video | Kling + ElevenLabs |

### Social Media & E-Commerce

| Example | Purpose | Status |
|---------|---------|--------|
| **[instagram-carousel-generator](./instagram-carousel-generator/)** | 5 videos in 1:1, 4:5, 9:16 formats | 📝 Implementation needed |
| **[product-demo-walkthrough](./product-demo-walkthrough/)** | Screen-recording style demos | 📝 Implementation needed |

### Video Generation Patterns

| Example | Purpose | Status |
|---------|---------|--------|
| **[music-video-generator](./music-video-generator/)** | Music videos from lyrics + audio sync | 📝 Implementation needed |
| **[avatar-talking-head](./avatar-talking-head/)** | Talking-head avatars (PiP mode) | 📝 Implementation needed |
| **[screenplay-to-video](./screenplay-to-video/)** | Scripts → multi-scene videos | 📝 Implementation needed |

### Model & Orchestration Patterns

| Example | Purpose | Status |
|---------|---------|--------|
| **[multi-model-comparison](./multi-model-comparison/)** | Render with Kling, Veo, Runway side-by-side | 📝 Implementation needed |
| **[failover-routing](./failover-routing/)** | Automatic fallback if primary fails | 📝 Implementation needed |
| **[cost-prediction](./cost-prediction/)** | Estimate costs before rendering | 📝 Implementation needed |

### Advanced Workflows

| Example | Purpose | Status |
|---------|---------|--------|
| **[webhook-async-pipeline](./webhook-async-pipeline/)** | Async rendering with callbacks | 📝 Implementation needed |
| **[byok-orchestration](./byok-orchestration/)** | Use your own provider keys | 📝 Implementation needed |
| **[brand-consistency-agent](./brand-consistency-agent/)** | Remember style across renders | 📝 Implementation needed |
| **[real-time-viral-clip](./real-time-viral-clip/)** | Trending topic → video < 5 min | 📝 Implementation needed |

---

## How to Use This Cookbook

### 1. **Pick an Example**

Choose based on your use case. Start with production-ready ones if you're new.

### 2. **Clone the Example**

```bash
cd examples/instagram-carousel-generator
cp .env.example .env
```

### 3. **Add Your API Key**

```bash
# Get key from https://varosity.ai/app/keys/api-keys
# Add to .env:
echo "VAROSITY_API_KEY=vsk_live_YOUR_KEY_HERE" >> .env
```

### 4. **Install & Run**

```bash
npm install
npm run generate -- --help  # See available options
npm run generate -- --brief "Your content brief"
```

### 5. **Customize**

Each example is standalone. Modify `src/index.ts` to fit your needs.

---

## Integration Patterns

### Pattern 1: Single-Shot Video

```typescript
import { MCPClient } from "@varosity/mcp-client";

const client = new MCPClient({ apiKey: process.env.VAROSITY_API_KEY });
const video = await client.generateVideo({
  prompt: "A cat playing piano",
  durationSec: 5,
  modelId: "kling-1"
});
```

### Pattern 2: Multi-Shot with Stitch

```typescript
// Generate multiple clips
const clips = await Promise.all([
  client.generateVideo({ prompt: "Shot 1: Hero...", durationSec: 5 }),
  client.generateVideo({ prompt: "Shot 2: Feature...", durationSec: 5 }),
  client.generateVideo({ prompt: "Shot 3: CTA...", durationSec: 3 })
]);

// Stitch together
const final = await client.renderProject({
  shots: clips,
  outputFormat: "mp4"
});
```

### Pattern 3: Parallel Model Comparison

```typescript
// Render same prompt with 3 models
const [kling, veo, runway] = await Promise.all([
  client.generateVideo({ prompt, modelId: "kling-1" }),
  client.generateVideo({ prompt, modelId: "veo-2" }),
  client.generateVideo({ prompt, modelId: "runway-gen-4" })
]);

// User picks winner
const winner = await userSelectsBest([kling, veo, runway]);
```

### Pattern 4: Async Webhook Pipeline

```typescript
// Create webhook
const webhook = await client.createWebhook({
  url: "https://yourapi.com/on-video-done",
  events: ["video.completed", "video.failed"]
});

// Trigger render
const job = await client.generateVideo({ prompt, modelId: "kling-1" });

// Wait for webhook callback instead of polling
// Your server gets notified when done
```

### Pattern 5: Cost-Controlled Rendering

```typescript
// Estimate cost
const estimate = await client.suggestModel({ prompt });
console.log(`Estimated cost: $${estimate.cost}`);

// User approves
if (await userApprovesSpend(estimate.cost)) {
  const video = await client.generateVideo({
    prompt,
    modelId: estimate.modelId
  });
}
```

---

## Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- **Varosity API key** — Get one at https://varosity.ai/app/keys/api-keys
- **Internet connection** — All videos generated in cloud

---

## Common Issues

### "Invalid API Key"
1. Check your key starts with `vsk_live_`
2. Copy it exactly (no spaces)
3. Create a new one if needed: https://varosity.ai/app/keys/api-keys

### "Rate Limited"
- Standard limit: 100 videos/day
- Upgrade plan for higher limits
- Retry with exponential backoff (auto-handled)

### "Video Generation Timeout"
- Most videos finish in 10–60 seconds
- Complex prompts may take longer
- Check https://varosity.ai/status for incidents

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Deploying to Production

### Option 1: Serverless (AWS Lambda / Vercel)

Use webhook pattern (see Pattern 4) for async rendering. Don't wait for videos in sync functions.

### Option 2: Background Job (Bull / RabbitMQ)

```typescript
// Enqueue render job
const job = await videoQueue.add({ prompt, modelId });

// Worker polls or uses webhook
await job.waitForCompletion();
```

### Option 3: Cron Job

```typescript
// Daily viral clip generator
schedule.every().day().at("9:00 AM").do(async () => {
  const videos = await generateViralClips();
  await uploadToSocial(videos);
});
```

---

## Contributing

Found a bug or want to add an example? PRs welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Resources

- 📖 **[API Reference](https://github.com/varosity-ai/api)** — All 35+ tools
- 🎓 **[Prompting Guide](https://github.com/varosity-ai/api/blob/main/guides/prompting-cheatsheet.md)** — Write better video prompts
- 💬 **[GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions)** — Ask questions
- 🐛 **[Report Issues](https://github.com/varosity-ai/issues-public/issues)** — Found a problem?
- 🌐 **[Varosity.ai](https://varosity.ai)** — Dashboard & billing

---

## License

MIT — See LICENSE in each example directory.

---

**Questions?** Post in [GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions) and we'll help!

*Last updated: 2026-05-15*
