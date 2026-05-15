# brand-campaign-agent

An example agent that runs a full multi-shot brand campaign using the Varosity MCP API.

## What it does

1. Calls `plan_storyboard` with a creative brief to produce shot list + copy
2. Calls `pick_reference_images` per shot for visual reference selection
3. Calls `generate_video` for each shot in parallel (returns job IDs)
4. Polls `get_job` until all shots complete
5. Calls `render_project` to stitch shots into a final MP4 (ffmpeg concat fallback if render_project returns Unauthorized)
6. Optionally calls `generate_voice` for voiceover and `generate_end_card` for the closing frame

## Prerequisites

- Node.js 18+
- A Varosity API key (`vsk_…`) from [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)

## Quickstart

```bash
cp .env.example .env
# Add your VAROSITY_API_KEY to .env
npm install
npm run campaign -- --brief "Launch a 3-shot luxury watch campaign. Cinematic, dark background, slow motion."
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VAROSITY_API_KEY` | Bearer token (`vsk_…`) |
| `VAROSITY_MCP_URL` | Override MCP endpoint (default: `https://varosity.ai/api/mcp`) |

## MCP connection

This agent connects to Varosity via streamable-HTTP MCP:

```
URL:       https://varosity.ai/api/mcp
Transport: streamable-http
Auth:      Authorization: Bearer vsk_<your_key>
```

See [varosity.ai/docs/agent-mode](https://varosity.ai/docs/agent-mode) for full integration docs.

## File structure

```
brand-campaign-agent/
├── src/
│   ├── index.ts          # CLI entrypoint + argument parsing
│   ├── mcp-client.ts     # Thin MCP JSON-RPC client over fetch
│   ├── campaign.ts       # Orchestration: plan → reference → generate → stitch
│   └── ffmpeg-concat.ts  # Fallback: client-side ffmpeg concat if render_project fails
├── .env.example
├── package.json
└── tsconfig.json
```

## Notes

- `pick_reference_images` is mandatory before every `generate_video` call. Skipping it risks a bad $2–10 render.
- `render_project` may return "Unauthorized" depending on your account tier. The ffmpeg fallback handles this transparently.
- Call `refresh_skills` at session start to pull the latest tool schemas before generating.
