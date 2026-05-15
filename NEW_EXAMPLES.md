# Planned Cookbook Examples (12 new + 3 existing = 15 total)

## Existing (3)
1. brand-campaign-agent — Multi-shot storyboard + parallel renders
2. product-reel-generator — Product video from description + end card
3. news-to-shorts — News headline → 9:16 voiced video

## High-Impact New Examples (12)

### 1. instagram-carousel-generator
**Use case:** Create 5-frame carousel from product description
**Tools:** generate_video (multi-aspect), stitch frames
**Output:** 5 Instagram-ready MP4s (1:1, 4:5, 9:16 variants)

### 2. music-video-generator
**Use case:** Generate music video from lyrics + style prompt
**Tools:** generate_music, generate_video (sync to audio)
**Output:** Full music video with audio

### 3. avatar-talking-head
**Use case:** Create professional talking-head video (person explaining)
**Tools:** generate_voice (voiceover), generate_video (avatar PiP mode)
**Output:** 30–60s explainer video with avatar

### 4. multi-model-comparison
**Use case:** Render same prompt in Kling, Veo, Runway — let user pick best
**Tools:** generate_video (parallel x3), compare render quality
**Output:** 3 videos side-by-side for selection

### 5. webhook-async-pipeline
**Use case:** Trigger video render via webhook, get notified when done
**Tools:** create_webhook, generate_video, render_project
**Output:** Async render with callback notification

### 6. byok-orchestration
**Use case:** Use your own Kling/Veo API keys instead of Varosity credits
**Tools:** generate_video with BYOK keys, billing tracking
**Output:** Full video with billing to your provider account

### 7. failover-routing
**Use case:** If Kling fails, automatically retry with Veo
**Tools:** generate_video (retry with fallback model)
**Output:** Video or error with helpful debugging

### 8. cost-prediction
**Use case:** Estimate video cost before rendering
**Tools:** suggest_model, cost_estimate, generate_video
**Output:** Budget check + confirmation before render

### 9. brand-consistency-agent
**Use case:** Remember brand style (colors, camera angles) across videos
**Tools:** generate_video (with context memory), brand preferences storage
**Output:** Consistent visual style across renders

### 10. screenplay-to-video
**Use case:** Convert screenplay/script into multi-scene video
**Tools:** generate_video (per scene), stitch scenes, add voiceover
**Output:** Full film from screenplay

### 11. real-time-viral-clip
**Use case:** Trending topic → script → video in < 5 minutes
**Tools:** LLM orchestration, generate_video, publish hooks
**Output:** Viral-ready short-form video

### 12. product-demo-walkthrough
**Use case:** Screen-recording style product walkthrough video
**Tools:** generate_video (with reference images for consistency)
**Output:** Professional product demo

---

**Effort per example:** 1–1.5h (code + docs + .env.example)
**Total for 12:** 12–18h (realistic: 14h)
**Timeline:** 3–4 days of focused work
