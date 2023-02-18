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

export async function loader({ params }: LoaderArgs) {
  const { product } = (await query(PRODUCT_QUERY, {
    handle: params.handle,
  })) as any;

  return json({ product });
}

export default function ProductDetailPage() {
  const { product } = useLoaderData();
  const title = product.title.substring(0, product.title.indexOf("("));
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
            <AddToCartButton
              type="button"
              data={variantId}
              className="bg-fox-green text-white rounded py-2 px-12 mt-4 lg:mt-8"
            >
              Add to cart
            </AddToCartButton>
            <div
              className="product-description mt-8"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
        <CSAFaq />
      </ProductProvider>
    </>
  );
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
