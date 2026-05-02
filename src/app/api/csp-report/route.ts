export async function POST(request: Request) {
  try {
    await request.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 204 });
}
