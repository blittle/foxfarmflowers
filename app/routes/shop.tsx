import { NewsLetterForm } from "./signup";
import { getSession, commitSession } from "../sessions";
import { json, LoaderArgs } from "@remix-run/cloudflare";
import { query } from "~/shop-client";
import { useLoaderData } from "@remix-run/react";
import { flattenConnection, Image } from "@shopify/storefront-kit-react";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/css/shop.css",
    },
  ];
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const { products } = (await query(ALL_PRODUCTS)) as any;

  return json(
    {
      products: flattenConnection(products),
      signup: session.get("signup"),
      signup_error: session.get("signup_error"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Shop() {
  const { products } = useLoaderData();
  console.log(products);
  return (
    <div className="grid-container">
      {products.map((product) => (
        <div key={product.id}>
          <Image data={product.variants.nodes[0].image} />
          <h2>{product.title}</h2>
        </div>
      ))}
    </div>
  );
}

const ALL_PRODUCTS = `
  query ProductsPage {
    products(first: 10) {
      nodes {
        id
        title
        publishedAt
        handle
        variants(first: 1) {
          nodes {
            id
            image {
              url
              altText
              width
              height
            }
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
