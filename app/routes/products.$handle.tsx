import { json, LoaderArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { query } from "~/shop-client";
import {
  ProductPrice,
  Image,
  AddToCartButton,
  ProductProvider,
} from "@shopify/storefront-kit-react";
import { useState } from "react";
import CSAFaq from "~/components/CSAFaq";
import { ProductVariant } from "@shopify/storefront-kit-react/storefront-api-types";

export async function loader({ params }: LoaderArgs) {
  const { product } = (await query(PRODUCT_QUERY, {
    handle: params.handle,
  })) as any;

  return json({ product, handle: params.handle });
}

function AddToCartVariant({
  variant,
  label,
}: {
  variant: any;
  label?: string;
}) {
  const variantId = variant.id;
  const available = variant.availableForSale;
  console.log("bret", variantId, available);

  return (
    <AddToCartButton
      type="button"
      disabled={!available}
      data={variantId}
      className={`bg-fox-green text-white rounded py-2 px-12 mt-4 lg:mt-8 ${
        !available && "opacity-50"
      }`}
    >
      {available ? (label ? label : "Add to cart") : "Sold out!"}
    </AddToCartButton>
  );
}

export default function ProductDetailPage() {
  const { product } = useLoaderData();
  const fullTitle = product.title;
  const isCSA = fullTitle.includes("CSA");
  const title = isCSA
    ? product.title.substring(0, product.title.indexOf("("))
    : fullTitle;

  console.log(product.variants.nodes);
  const multipleVariants = product.variants.nodes.length > 1;
  const variantId = product.variants.nodes[0].id;

  return (
    <>
      <ProductProvider data={product} initialVariantId={variantId}>
        <div className="flex lg:flex-row flex-col-reverse py-8 lg:pt-0">
          <div className="w-full lg:w-1/2 lg:pr-6 mt-4 lg:mt-0">
            <Image data={product.media.nodes[1].image} widths={[500]} />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-4 px-4 lg:pr-0 text-center lg:text-left">
            <h1 className="montagu text-2xl uppercase fox-green font-bold mb-2 lg:mb-8">
              {title}
            </h1>
            <ProductPrice data={product} variantId={variantId} />
            <AddToCartVariant
              variant={product.variants.nodes[0]}
              label={!isCSA ? "Pick-up in North Berwick, ME" : undefined}
            />
            {multipleVariants ? (
              <AddToCartVariant
                variant={product.variants.nodes[1]}
                label={"Pick-up in Dover, NH"}
              />
            ) : null}
            <div
              className="product-description mt-8"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
        {isCSA ? <CSAFaq /> : null}
      </ProductProvider>
    </>
  );
}

function makeLocationQuery(location: string) {
  return location.toLowerCase().split(" ").join("-");
}

const MEDIA_FRAGMENT = `
  fragment Media on Media {
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
`;

const PRODUCT_QUERY = `
  ${MEDIA_FRAGMENT}
  query Product(
    $handle: String!
  ) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      productType
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
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
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;
