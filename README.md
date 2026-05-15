# Varosity Example Agents

Ready-to-run example agents that use the [Varosity MCP API](https://varosity.ai/api/mcp).

Each example is a standalone Node.js 18+ TypeScript project. Copy `.env.example` → `.env`, add your `vsk_` API key, and run.

## Examples

| Directory | What it does |
|-----------|-------------|
| [`brand-campaign-agent/`](./brand-campaign-agent/) | Multi-shot brand campaign: storyboard → parallel renders → final stitch |
| [`product-reel-generator/`](./product-reel-generator/) | Single product shot: image-to-video reel with optional branded end card |
| [`news-to-shorts/`](./news-to-shorts/) | News headline → voiced short-form 9:16 video with parallel shot renders |

## Prerequisites

- Node.js 18+
- A Varosity API key from [varosity.ai/app/keys/api-keys](https://varosity.ai/app/keys/api-keys)

## Getting started

```bash
cd examples/brand-campaign-agent
cp .env.example .env
# Edit .env and add your VAROSITY_API_KEY
npm install
npm run campaign -- --brief "A 3-shot luxury product launch. Dark background, cinematic."
```

## MCP connection

All examples connect to Varosity via streamable-HTTP MCP:

```
URL:       https://varosity.ai/api/mcp
Transport: streamable-http
Auth:      Authorization: Bearer vsk_<your_key>
```

See the [integration guide](https://varosity.ai/api/v1/skills/varosity-mcp-agent-integration) for full docs on all 35 tools, auth, and connection examples for Claude Desktop, Cursor, Hermes, and custom Python agents.
