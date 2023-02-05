import { LoaderArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderArgs) {
  const requestUrl = new URL(request.url);
  const proxyUrl = requestUrl.searchParams.get("url");

  if (!proxyUrl) throw BadRequest("URL param required");
  if (new URL(proxyUrl).hostname !== "connect.facebook.net")
    throw BadRequest("Invalid URL");

  return fetch(proxyUrl);
}

function BadRequest(message: string): Response {
  return new Response(message, {
    status: 400,
  });
}
