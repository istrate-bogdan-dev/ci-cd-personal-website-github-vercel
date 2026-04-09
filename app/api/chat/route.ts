import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { NextRequest, NextResponse } from "next/server";

const SSM_PARAM = "/portfolio/n8n/internal-key";
const N8N_WEBHOOK_URL = "https://n8n.bogdanistrate.ro/webhook/chat";
const MAX_MESSAGE_LENGTH = 500;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ssmClient = new SSMClient({ region: process.env.AWS_REGION ?? "eu-central-1" });

let cachedSecret: string | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute

async function getInternalKey(): Promise<string> {
  const now = Date.now();
  if (cachedSecret && now < cacheExpiry) {
    return cachedSecret;
  }
  const cmd = new GetParameterCommand({ Name: SSM_PARAM, WithDecryption: true });
  const result = await ssmClient.send(cmd);
  const value = result.Parameter?.Value;
  if (!value) throw new Error("SSM parameter missing");
  cachedSecret = value;
  cacheExpiry = now + CACHE_TTL_MS;
  return value;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).message !== "string" ||
    typeof (body as Record<string, unknown>).sessionId !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, sessionId } = body as { message: string; sessionId: string };

  if (message.trim().length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  if (!UUID_REGEX.test(sessionId)) {
    return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
  }

  let internalKey: string;
  try {
    internalKey = await getInternalKey();
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  let n8nRes: Response;
  try {
    n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": internalKey,
      },
      body: JSON.stringify({ message, sessionId }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return NextResponse.json({ error: "Gateway timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
  }

  if (!n8nRes.ok) {
    return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
  }

  let data: unknown;
  try {
    data = await n8nRes.json();
  } catch {
    return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
  }

  if (typeof (data as Record<string, unknown>)?.reply !== "string") {
    return NextResponse.json({ error: "Bad gateway" }, { status: 502 });
  }

  return NextResponse.json({ reply: (data as { reply: string }).reply });
}
