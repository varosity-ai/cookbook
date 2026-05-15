# Instagram Carousel Generator

Generate 5 Instagram-ready videos optimized for different formats — perfect for product launches, e-commerce, and multi-format social media campaigns.

## What It Does

```
Input: Product description + style prompt
    ↓
Output: 5 videos in optimal Instagram formats:
  1. Hero shot (1:1 square) — Feed thumbnail
  2. Detail shot (4:5 portrait) — Feed primary
  3. Lifestyle (9:16 vertical) — Reels + Stories
  4. Unboxing (9:16 vertical) — Premium reveal
  5. Call-to-action (1:1 square) — Conversion driver
```

**Perfect for:**
- E-commerce product launches
- Brand awareness campaigns
- Multi-format social media campaigns
- Product photography on a budget
- AI-powered content at scale

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Varosity API key** — Get one at [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)
- **Internet connection** (all videos render in Varosity cloud)

## Getting Started

### Step 1: Clone and Setup

```bash
# Navigate to this example
cd instagram-carousel-generator

# Copy environment template
cp .env.example .env

# Edit .env and add your API key
# (Open .env in your editor, paste your key, save)
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Generate Your First Carousel

```bash
npm run generate -- --product "Luxury wireless headphones" --style "premium, sleek, minimal"
```

### Step 4: Expected Output

```
🎬 Generating Instagram Carousel (5 videos)...

  📤 Submitting: hero-1-1 (1:1)...
     Job ID: job_abc123xyz
  📤 Submitting: detail-4-5 (4:5)...
     Job ID: job_def456uvw
  📤 Submitting: lifestyle-9-16 (9:16)...
     Job ID: job_ghi789rst
  📤 Submitting: unboxing-9-16 (9:16)...
     Job ID: job_jkl012opq
  📤 Submitting: cta-1-1 (1:1)...
     Job ID: job_mno345lmn

⏳ Waiting for videos to render...
  ⏳ Waiting for hero-1-1...
     ✓ Complete: https://cdn.varosity.ai/videos/xyz123.mp4
  ⏳ Waiting for detail-4-5...
     ✓ Complete: https://cdn.varosity.ai/videos/def456.mp4
  ⏳ Waiting for lifestyle-9-16...
     ✓ Complete: https://cdn.varosity.ai/videos/ghi789.mp4
  ⏳ Waiting for unboxing-9-16...
     ✓ Complete: https://cdn.varosity.ai/videos/jkl012.mp4
  ⏳ Waiting for cta-1-1...
     ✓ Complete: https://cdn.varosity.ai/videos/mno345.mp4

✅ Carousel complete!

📊 Summary:
  - 1:1     (5s): https://cdn.varosity.ai/videos/xyz123.mp4
  - 4:5     (5s): https://cdn.varosity.ai/videos/def456.mp4
  - 9:16    (5s): https://cdn.varosity.ai/videos/ghi789.mp4
  - 9:16    (8s): https://cdn.varosity.ai/videos/jkl012.mp4
  - 1:1     (3s): https://cdn.varosity.ai/videos/mno345.mp4

  Total cost: $2.50
  Render time: 45.3s

📦 Ready to post!
  - All 5 videos are generated and ready
  - Use Postiz, Buffer, or native Instagram to schedule
  - Share on Instagram Reels, Feed, and Stories
```

## Usage Examples

### Example 1: Luxury Headphones

```bash
npm run generate -- \
  --product "Luxury wireless headphones with active noise cancellation" \
  --style "premium, sleek, minimalist" \
  --brand-color "deep black with gold accents" \
  --duration 5 \
  --model kling-1
```

### Example 2: Skincare Product (Fast & Cheap)

```bash
npm run generate -- \
  --product "Organic sunscreen SPF 50" \
  --style "clean, natural, green" \
  --brand-color "white and green" \
  --model veo-2          # Faster, cheaper than Kling
```

### Example 3: Tech Gadget (Premium Quality)

```bash
npm run generate -- \
  --product "Wireless charging pad with 360° rotation" \
  --style "futuristic, minimalist, tech-forward" \
  --brand-color "silver and blue" \
  --model kling-1        # Best quality for tech products
```

## Command-Line Options

```bash
npm run generate -- [options]

Options:
  --product <name>         Product name/description (required)
  --style <description>    Visual style (optional, default: "premium, sleek")
  --brand-color <color>    Brand color(s) (optional)
  --duration <seconds>     Video duration (optional, default: 5)
  --model <model>          Video model to use (optional, default: "kling-1")
                          Options:
                            - kling-1      Best quality, slower, $2-3/video
                            - veo-2        Good quality, fast, $1-2/video
                            - runway-gen-4 Experimental, cheapest
  --help                   Show help message
```

## Cost Estimation

| Model | Quality | Speed | Cost/Video | 5-Video Cost |
|-------|---------|-------|-----------|--------------|
| Kling 1 | ⭐⭐⭐⭐⭐ | 30-40s | $0.50 | $2.50 |
| Veo 2 | ⭐⭐⭐⭐ | 15-20s | $0.35 | $1.75 |
| Runway Gen-4 | ⭐⭐⭐ | 20-30s | $0.25 | $1.25 |

**Recommendation:** Use Kling 1 for e-commerce and high-end products. Use Veo 2 for rapid prototyping and cost optimization.

## Integration with Social Media Tools

### Option 1: Postiz (Recommended)

1. Generate videos with this tool
2. Create a campaign in [Postiz](https://postiz.com)
3. Upload 5 videos as carousel
4. Schedule for optimal posting times
5. Track engagement and analytics

### Option 2: Native Instagram

1. Generate videos
2. Go to Instagram.com → Create Post
3. Select "Carousel" → Upload 5 videos
4. Add captions, links, stickers
5. Post or schedule

### Option 3: Meta Business Suite

1. Generate videos
2. Use [Meta Business Suite](https://business.facebook.com)
3. Schedule across Instagram + Facebook
4. Monitor insights and engagement

## Advanced: Programmatic Usage

```typescript
import { generateInstagramCarousel } from "./src/index";

const carousel = await generateInstagramCarousel({
  product: "Luxury wireless headphones",
  style: "premium, sleek, minimal",
  brandColor: "deep black with gold",
  duration: 5,
  modelId: "kling-1"
});

console.log(carousel.videos);
// [
//   { jobId: "...", outputUrl: "https://...", aspectRatio: "1:1", ... },
//   { jobId: "...", outputUrl: "https://...", aspectRatio: "4:5", ... },
//   { jobId: "...", outputUrl: "https://...", aspectRatio: "9:16", ... },
//   { jobId: "...", outputUrl: "https://...", aspectRatio: "9:16", ... },
//   { jobId: "...", outputUrl: "https://...", aspectRatio: "1:1", ... }
// ]

console.log(carousel.estimatedCost); // 2.50
```

## Troubleshooting

### "VAROSITY_API_KEY is required"

**Solution:**
1. Get your API key at [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)
2. Copy it (format: `vsk_live_...`)
3. Edit `.env` file and paste it:
   ```
   VAROSITY_API_KEY=vsk_live_YOUR_KEY_HERE
   ```

### "Video generation timed out"

**Cause:** Complex prompts or high server load

**Solution:**
- Retry with simpler prompt: `--product "Headphones"`
- Use faster model: `--model veo-2`
- Check [Varosity status](https://varosity.ai/status) for incidents

### "Videos look inconsistent"

**Cause:** Each video uses independent prompts

**Solution:**
- Add shared visual elements to all prompts
- Edit `src/index.ts` and include brand guidelines in frame prompts
- Use same `--brand-color` across all generations

### "Cost is too high"

**Solution:**
- Use `--model veo-2` instead (50-75% cheaper)
- Reduce `--duration` to 3-4 seconds
- Skip the unboxing video (remove from carousel)

### "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance Tips

1. **Batch operations:** Generate multiple carousels in parallel (API supports 10+ concurrent jobs)
2. **Model selection:** Veo 2 is 2x faster than Kling for similar quality
3. **Prompt clarity:** Short, specific prompts render faster than long descriptions
4. **Duration:** 5-second videos render faster than 8-second videos

## Next Steps

- **Automate:** Create a cron job to generate carousel weekly
- **Integrate:** Call from your product feed (Shopify, WooCommerce, etc.)
- **Monitor:** Track engagement on Instagram via Meta Business Suite
- **Optimize:** A/B test different styles and colors

## Resources

- 📖 **[Varosity API Reference](https://github.com/varosity-ai/api)** — Full API documentation
- 🎓 **[Prompting Guide](https://github.com/varosity-ai/api/blob/main/guides/prompting-cheatsheet.md)** — Write better video prompts
- 💬 **[GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions)** — Ask questions, share results
- 🐛 **[Report Issues](https://github.com/varosity-ai/issues-public/issues)** — Found a bug?
- 🌐 **[Varosity Studio](https://varosity.ai/app/studio)** — Dashboard & billing

## Support

Stuck? Questions? Post in [GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions) under **"Video Generation Questions"** and we'll help!

---

**License:** MIT  
**Author:** Varosity  
**Version:** 0.1.0  
**Last Updated:** 2026-05-15

*Proud member of the [Varosity Cookbook](https://github.com/varosity-ai/cookbook) — Agent-first examples for modern AI workflows.*
