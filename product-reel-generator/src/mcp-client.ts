const VAROSITY_MCP_URL =
  process.env.VAROSITY_MCP_URL ?? "https://varosity.ai/api/mcp";

let _reqId = 0;

export async function callTool<T = unknown>(
  toolName: string,
  args: Record<string, unknown>,
): Promise<T> {
  const apiKey = process.env.VAROSITY_API_KEY;
  if (!apiKey) throw new Error("VAROSITY_API_KEY is not set");

  const res = await fetch(VAROSITY_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: toolName, arguments: args },
      id: ++_reqId,
    }),
  });

  if (!res.ok) throw new Error(`MCP HTTP ${res.status}`);
  const json = (await res.json()) as {
    result?: { content?: { text: string }[] };
    error?: { message: string };
  };
  if (json.error) throw new Error(`MCP error: ${json.error.message}`);
  const text = json.result?.content?.[0]?.text;
  if (!text) throw new Error("MCP response missing content[0].text");
  return JSON.parse(text) as T;
}
