import handler from "../../../../api/chat";

type ResponseAdapter = {
  statusCode: number;
  headers: Headers;
  body: unknown;
  setHeader(name: string, value: string | string[]): void;
  status(code: number): ResponseAdapter;
  json(body: unknown): void;
};

function createResponseAdapter(): ResponseAdapter {
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

export async function POST(request: Request) {
  const requestBody = (await request.json().catch(() => undefined)) as unknown;
  const responseAdapter = createResponseAdapter();

  await handler(
    {
      method: "POST",
      body: requestBody,
    },
    responseAdapter,
  );

  return Response.json(responseAdapter.body, {
    status: responseAdapter.statusCode,
    headers: responseAdapter.headers,
  });
}

export function GET() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405, headers: { Allow: "POST" } });
}
