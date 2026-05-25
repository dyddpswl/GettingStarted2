import handler from "../../../../api/chat";

export const runtime = "nodejs";
export const maxDuration = 30;

type AdapterResponse = {
  statusCode: number;
  headers: Headers;
  body: unknown;
  setHeader(name: string, value: string | string[]): void;
  status(code: number): AdapterResponse;
  json(body: unknown): void;
};

function createAdapterResponse(): AdapterResponse {
  return {
    statusCode: 200,
    headers: new Headers(),
    body: undefined,
    setHeader(name, value) {
      this.headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
}

async function runHandler(method: string, body?: unknown) {
  const adapterResponse = createAdapterResponse();

  await handler(
    {
      method,
      body,
    },
    adapterResponse,
  );

  return Response.json(adapterResponse.body, {
    status: adapterResponse.statusCode,
    headers: adapterResponse.headers,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => undefined)) as unknown;
  return runHandler("POST", body);
}

export function GET() {
  return runHandler("GET");
}
