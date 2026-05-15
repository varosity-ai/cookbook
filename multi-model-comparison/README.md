# Multi-Model Comparison Tool

Generate the same video with 3 different AI models and compare quality, speed, and cost. **Perfect for agents deciding which model to use.**

## What It Does

```
Input: Prompt + duration + aspect ratio
    ↓
Output: 3 videos (Kling, Veo, Runway)
    ↓
Comparison Report:
  - Quality: ⭐⭐⭐⭐⭐ (Kling) vs ⭐⭐⭐⭐ (Veo) vs ⭐⭐⭐ (Runway)
  - Speed: 30s (Veo) vs 40s (Kling) vs 20s (Runway)
  - Cost: $0.35 (Veo) vs $0.50 (Kling) vs $0.20 (Runway)
    ↓
Recommendation: Use X model for your use case
```

## Why This Matters

**The Question Agents Ask:**
> "I have a video to generate. Which model should I use?"

**This Tool Answers It:**
- Generate 3 videos in parallel
- See quality/speed/cost tradeoffs side-by-side
- Make informed decisions, not guesses

**Perfect for:**
- Choosing models for production pipelines
- Cost optimization
- Quality requirements validation
- Agent decision-making logic
- Benchmarking new models

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Varosity API key** — Get one at [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)

## Getting Started

### Step 1: Clone and Setup

```bash
cd multi-model-comparison
cp .env.example .env
# Edit .env and paste your API key
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Your First Comparison

```bash
npm run compare
```

### Step 4: Expected Output

```
🎬 Multi-Model Comparison Test

Prompt: "A sleek modern wireless headphone, premium packaging, product shot, studio lighting"
Duration: 5s | Aspect: 16:9

📤 Submitting jobs...

  → Kling 1.0       (quality: ultra, speed: slow)
    Job ID: job_kling_123
  → Veo 2           (quality: high, speed: medium)
    Job ID: job_veo_456
  → Runway Gen-4    (quality: medium, speed: fast)
    Job ID: job_runway_789

⏳ Rendering 3 videos in parallel...

  ⏳ Kling 1.0...
     ✓ Complete in 38.2s
  ⏳ Veo 2...
     ✓ Complete in 22.5s
  ⏳ Runway Gen-4...
     ✓ Complete in 18.3s

✅ Comparison Complete!

📊 RESULTS TABLE

┌──────────────┬──────────────┬────────────┬────────┬─────────────────────────┐
│ Model        │ Render Time  │ Cost/Video │ Status │ URL                     │
├──────────────┼──────────────┼────────────┼────────┼─────────────────────────┤
│ Kling 1.0    │ 38.2s        │ $0.50      │ ✓      │ https://cdn.varosity... │
│ Veo 2        │ 22.5s        │ $0.35      │ ✓      │ https://cdn.varosity... │
│ Runway Gen-4 │ 18.3s        │ $0.20      │ ✓      │ https://cdn.varosity... │
└──────────────┴──────────────┴────────────┴────────┴─────────────────────────┘

🏆 WINNERS

  Highest Quality: Kling 1.0 (Ultra HD)
  Fastest: Runway Gen-4 (18.3s)
  Cheapest: Runway Gen-4 ($0.20)

💡 RECOMMENDATION

  → For budget: Runway Gen-4 ($0.20)
  → For speed: Runway Gen-4 (18.3s)
  → For quality: Kling 1.0 (premium)

📈 QUALITY MATRIX

  Kling 1.0  : ⭐⭐⭐⭐⭐ Ultra HD, perfect for hero shots
  Veo 2      : ⭐⭐⭐⭐ Great for most use cases, best value
  Runway Gen-4: ⭐⭐⭐ Good for prototyping, experimental

🔗 Watch Generated Videos

  Kling 1.0     → https://cdn.varosity.ai/videos/xyz123.mp4
  Veo 2         → https://cdn.varosity.ai/videos/def456.mp4
  Runway Gen-4  → https://cdn.varosity.ai/videos/ghi789.mp4
```

## Usage Examples

### Example 1: Quick Comparison (Default)

```bash
# Uses default product shot prompt
npm run compare
```

### Example 2: Custom Product

```bash
npm run compare -- \
  --prompt "Luxury watch with diamond bezel, gold bracelet, elegant close-up" \
  --duration 5
```

### Example 3: Fast Models Only (Budget)

```bash
npm run compare -- \
  --models veo-2,runway-gen-4 \
  --prompt "Quick product demo, energetic music" \
  --duration 3
```

### Example 4: Quality-First (Hero Shot)

```bash
npm run compare -- \
  --models kling-1,veo-2 \
  --prompt "Hero shot: sleek minimalist product in dramatic lighting" \
  --duration 8 \
  --aspect 16:9
```

### Example 5: Vertical Video (Reels/Stories)

```bash
npm run compare -- \
  --aspect 9:16 \
  --prompt "Quick TikTok-style product reveal" \
  --duration 5
```

### Example 6: Long-Form (10 Second Hero)

```bash
npm run compare -- \
  --duration 10 \
  --prompt "Cinematic product shot with camera pan, premium lighting, expensive look" \
  --models kling-1
```

## Command-Line Options

```bash
npm run compare -- [options]

Options:
  --prompt, -p <text>     Video prompt (default: headphone example)
  --duration, -d <sec>    Video duration in seconds (default: 5)
  --models, -m <list>     Comma-separated models (default: kling-1,veo-2,runway-gen-4)
                         Available: kling-1, veo-2, runway-gen-4
  --aspect <ratio>        Aspect ratio (default: 16:9)
                         Options: 16:9, 9:16, 1:1, 4:5, 21:9
  --help, -h              Show this help
```

## Model Overview

| Model | Quality | Speed | Cost/5s | Best For |
|-------|---------|-------|---------|----------|
| **Kling 1.0** | ⭐⭐⭐⭐⭐ Ultra | 🐢 Slow (30-40s) | $0.50 | Premium product shots, hero videos, high-end commercials |
| **Veo 2** | ⭐⭐⭐⭐ High | 🚶 Medium (20-25s) | $0.35 | Most use cases, balanced value/quality |
| **Runway Gen-4** | ⭐⭐⭐ Good | 🏃 Fast (15-20s) | $0.20 | Prototyping, budget-conscious, rapid iteration |

### Decision Matrix

**When to Use Each Model:**

**Kling 1.0:**
- E-commerce product launches
- Brand hero videos
- Premium commercials
- When quality > budget
- Client-facing deliverables
- First impression matters

**Veo 2:**
- General-purpose videos
- Social media content
- Marketing campaigns
- When speed/quality/cost matter equally
- Scale content production
- **Most recommendations point here**

**Runway Gen-4:**
- Rapid prototyping
- A/B testing variations
- Budget-constrained projects
- Experimental content
- When 24h turnaround matters
- Cost optimization critical

## Cost Estimation

| Duration | Kling | Veo | Runway | Savings (Runway vs Kling) |
|----------|-------|-----|--------|--------------------------|
| 3s | $0.30 | $0.21 | $0.12 | 60% |
| 5s | $0.50 | $0.35 | $0.20 | 60% |
| 10s | $1.00 | $0.70 | $0.40 | 60% |

**Example:** Generating 100 videos:
- Kling: $50
- Veo: $35
- Runway: $20
- **Savings: $30 (60% cheaper with Runway)**

## Prompting Tips for Better Comparisons

### Good Prompts (Specific, Actionable)

```
"Luxury leather wallet, brown cognac, opened display, gold hardware, studio lighting, premium photography"
```

### Avoid (Too Vague)

```
"A product"
```

### Kling 1.0 Prompting (Go Premium)

```
"Cinematic hero shot: [product], professional lighting, 8K quality, dramatic shadows, expensive look, aspirational mood"
```

### Veo 2 Prompting (Balanced)

```
"High-quality product shot: [product], clear lighting, clean background, professional look"
```

### Runway Gen-4 Prompting (Simple, Direct)

```
"Product shot: [product]"
```

## How to Use This in Your Agents

### Use Case 1: Automatic Model Selection

```typescript
// Agent logic
const comparison = await compareModels(prompt, duration);

if (comparison.cheapest.estimatedCost < 0.30 && comparison.bestQuality.quality >= "high") {
  return comparison.cheapest.modelId;  // Use budget model
} else if (userBudget < 0.40) {
  return comparison.cheapest.modelId;
} else {
  return comparison.bestQuality.modelId;  // Use best quality
}
```

### Use Case 2: Cost Optimization Pipeline

```typescript
// Generate 1000 videos efficiently
for (const product of products) {
  const comparison = await compareModels(product.description, 5);
  
  // Choose model based on quality requirement
  const model = product.isPremium 
    ? comparison.bestQuality.modelId 
    : comparison.fastest.modelId;
  
  generateVideo(product, model);
}
```

### Use Case 3: Quality Assurance

```typescript
// Before shipping to client
const comparison = await compareModels(clientBrief.prompt);

if (comparison.bestQuality.status !== "succeeded") {
  throw new Error("Kling model failed — quality check");
}

// Only use Kling or Veo for production
if (!["kling-1", "veo-2"].includes(selectedModel)) {
  throw new Error("Only use premium models for client deliverables");
}
```

## Troubleshooting

### "VAROSITY_API_KEY is required"

**Solution:**
1. Get your API key at [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)
2. Copy it (format: `vsk_live_...`)
3. Edit `.env` and paste:
   ```
   VAROSITY_API_KEY=vsk_live_YOUR_KEY_HERE
   ```

### "Video generation timed out"

**Cause:** Long duration or complex prompt

**Solutions:**
- Try shorter duration: `--duration 3`
- Use faster model: `--models veo-2,runway-gen-4`
- Simplify prompt: `--prompt "Product shot"`

### "All 3 models finished but one failed"

**Solution:** This is fine — comparison still shows:
- 2 successful videos (compare quality/speed)
- 1 failed (report the issue)

Run again if needed, or skip the failed model.

### "Why is Runway cheaper but slower than Veo in my test?"

**Answer:** Speed varies based on:
- Server load
- Prompt complexity
- Duration length
- API backend state

Run multiple comparisons to see average performance.

### "Can I compare the same model twice?"

**Answer:** Yes (for baseline testing):
```bash
npm run compare -- --models kling-1,kling-1,kling-1
```

Shows consistency/variance in the same model.

## Integration Examples

### Next.js/Express Server

```typescript
app.post("/api/compare-models", async (req, res) => {
  const { prompt, duration } = req.body;
  const report = await compareModels(prompt, duration);
  
  // Return winner recommendation
  res.json({
    recommendation: report.cheapest.modelId,
    bestQuality: report.bestQuality.modelId,
    report
  });
});
```

### Workflow Orchestration (n8n)

1. User provides product description
2. Call compare-models endpoint
3. Trigger video generation with recommended model
4. Post to Instagram using recommended video

### Agent Framework (Hermes/Claude)

```
Agent prompt:
"You have access to compare_models() function. 
Before generating a video, compare all 3 models 
and pick the best one for the user's budget and timeline."
```

## Metrics to Track

After running comparisons over time:

| Metric | What It Means | Target |
|--------|--------------|--------|
| Avg Kling render time | Quality model baseline | 35-40s |
| Avg Veo render time | Production model baseline | 20-25s |
| Cost per video (avg) | Budget efficiency | < $0.35 |
| Quality variance | Consistency | < 5% |

## Resources

- 📖 **[Varosity API Reference](https://github.com/varosity-ai/api)** — Full API docs
- 🎓 **[Prompting Guide](https://github.com/varosity-ai/api/blob/main/guides/prompting-cheatsheet.md)** — Better prompts
- 💬 **[GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions)** — Ask questions
- 🔧 **[Model Capabilities](https://varosity.ai/models)** — Feature matrix

## Support

Questions? Post in [GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions) → **"Model Routing & Provider Selection"**

---

**License:** MIT  
**Author:** Varosity  
**Version:** 1.0.0  
**Last Updated:** 2026-05-15

*Use this to make smart model decisions. Your agents will thank you.*
