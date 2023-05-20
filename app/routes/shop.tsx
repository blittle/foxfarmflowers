import { NewsLetterForm } from "./signup";
import { getSession, commitSession } from "../sessions";
import { json, LoaderArgs } from "@remix-run/cloudflare";
import { query } from "~/shop-client";
import { Link, useLoaderData } from "@remix-run/react";
import {
  flattenConnection,
  ProductPrice,
  Image,
} from "@shopify/storefront-kit-react";
import type {
  Image as ImageType,
  Product,
} from "@shopify/storefront-kit-react/storefront-api-types";

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
  const { products } = useLoaderData() as { products: Array<Product> };
  return (
    <div className="grid-container">
      {products
        .sort((a, b) => {
          if (a.title === "Seasonal Bouquet") return -1;
          if (b.title === "Seasonal Bouquet") return 1;

          return a.totalInventory > b.totalInventory ? -1 : 1;
        })
        .map((product) => (
          <Link key={product.id} to={`/products/${product.handle}`}>
            <Image data={product.variants.nodes[0].image} widths={[300, 500]} />
            <h2 className="uppercase text-center mt-2 font-bold">
              {product.title}
            </h2>
            <ProductPrice
              data={product}
              className="text-center"
              variantId={product.variants.nodes[0].id}
            />
          </Link>
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
        totalInventory
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
