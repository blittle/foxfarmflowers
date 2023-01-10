import { LoaderArgs } from "@remix-run/cloudflare";

export async function loader({ request, params }: LoaderArgs) {
  const resp = await fetch(
    new URL(request.url).origin + "/raw-images/" + params.imageId
  );

  const headers = new Headers(resp.headers);
  headers.set("Cache-Control", "public, max-age=15552000");

  return new Response(resp.body, {
    headers,
  });
}
