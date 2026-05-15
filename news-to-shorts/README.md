# news-to-shorts

An example agent that converts a news headline + summary into a short-form vertical video (30–60s) with AI voiceover, using the Varosity MCP API.

## What it does

1. Takes a news headline + body text as input
2. Calls `plan_storyboard` to decompose the story into 3–5 visual shots
3. Calls `pick_reference_images` per shot to select matching visuals
4. Calls `generate_video` for each shot in parallel
5. Calls `generate_voice` to produce a voiceover from the headline + summary text
6. Polls all jobs in parallel until complete
7. Delivers shot URLs + voiceover URL (client-side assembly via ffmpeg)

## Prerequisites

- Node.js 18+
- A Varosity API key (`vsk_…`) from [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)
- ffmpeg (for final assembly — `brew install ffmpeg` on macOS)

## Quickstart

```bash
cp .env.example .env
# Add your VAROSITY_API_KEY to .env
npm install
npm run shorts -- \
  --headline "Breakthrough in quantum computing announced" \
  --body "Researchers at MIT have demonstrated a 1000-qubit processor..."
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VAROSITY_API_KEY` | Bearer token (`vsk_…`) |
| `VAROSITY_MCP_URL` | Override MCP endpoint (default: `https://varosity.ai/api/mcp`) |
| `VOICE_ID` | ElevenLabs voice ID for narration (optional, uses default if unset) |

## File structure

```
news-to-shorts/
├── src/
│   ├── index.ts        # CLI entrypoint + argument parsing
│   ├── mcp-client.ts   # Thin MCP JSON-RPC client over fetch
│   └── news-short.ts   # Orchestration: plan → images → video → voice → assemble
├── .env.example
├── package.json
└── tsconfig.json
```

## Notes

- Shots are generated with `suggest_model` to pick between documentary-style models (Kling 3.0, Seedance 4.5) depending on the visual prompt.
- Voiceover uses `generate_voice` with ElevenLabs Multilingual v2 by default. Set `VOICE_ID` to use a specific saved voice.
- Final assembly requires ffmpeg. The script outputs an ffmpeg concat command if you prefer to assemble manually.
- Call `refresh_skills` first — news-to-shorts relies on `plan_storyboard` which has evolved across versions.
