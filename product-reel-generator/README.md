# product-reel-generator

An example agent that turns a product description + hero image into a 15–30 second social media reel using the Varosity MCP API.

## What it does

1. Calls `suggest_model` with the shot description to pick the best model for product motion
2. Calls `create_project` and uses the provided product image as the reference
3. Submits a single `generate_video` job (image-to-video, 16:9 or 9:16)
4. Polls `get_job` until complete
5. Optionally appends a branded end card via `generate_end_card`
6. Delivers the final MP4 URL

## Prerequisites

- Node.js 18+
- A Varosity API key (`vsk_…`) from [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)
- A product image URL (public HTTPS or local file path)

## Quickstart

```bash
cp .env.example .env
# Add your VAROSITY_API_KEY to .env
npm install
npm run reel -- \
  --product "Luxury mechanical watch, brushed steel case" \
  --image "https://example.com/watch.jpg" \
  --duration 20 \
  --aspect 9:16
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VAROSITY_API_KEY` | Bearer token (`vsk_…`) |
| `VAROSITY_MCP_URL` | Override MCP endpoint (default: `https://varosity.ai/api/mcp`) |

## File structure

```
product-reel-generator/
├── src/
│   ├── index.ts        # CLI entrypoint + argument parsing
│   ├── mcp-client.ts   # Thin MCP JSON-RPC client over fetch
│   └── reel.ts         # Orchestration: model selection → render → end card
├── .env.example
├── package.json
└── tsconfig.json
```

## Notes

- Pass a public image URL as `--image`, or omit it to trigger `pick_reference_images` (generates 3 options).
- `suggest_model` is called first — it picks between Wan 2.5, Kling 3.0 Pro, or Seedance 4.5 depending on the shot type.
- End cards require `brandContext` (brand name, colors, tagline). See `generate_end_card` tool docs.
