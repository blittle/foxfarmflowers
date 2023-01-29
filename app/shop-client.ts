import { createStorefrontClient } from "@shopify/storefront-kit-react";

const shop = createStorefrontClient({
  publicStorefrontToken: "d49f8dc3b2d17b446bcea2fe0651aaba",
  storeDomain: "https://fox-farm-flowers-of-maine.myshopify.com",
  storefrontApiVersion: "2022-10",
});

function graphqlRequestBody(query: string, variables?: Record<string, any>) {
  return JSON.stringify({
    query,
    variables,
  });
}

export async function query(
  query: string,
  variables?: Record<string, unknown>
) {
  const response = await fetch(shop.getStorefrontApiUrl(), {
    body: graphqlRequestBody(query, variables),
    headers: shop.getPublicTokenHeaders(),
    method: "POST",
  });

  if (!response.ok) {
    let error = "Error: " + response.status + " " + response.statusText;
    try {
      const text = await response.text();
      error = text;
    } catch (e: any) {}

    throw new Error(error);
  }

  const json = (await response.json()) as { data: unknown };
  return json.data;
}
