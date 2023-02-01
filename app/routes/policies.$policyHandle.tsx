import {
  json,
  type MetaFunction,
  type LoaderArgs,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { query } from "~/shop-client";

import { ShopPolicy } from "@shopify/storefront-kit-react/storefront-api-types";

export async function loader({ request, params, context }: LoaderArgs) {
  const handle = params.policyHandle;

  if (!handle) {
    throw new Response(null, { status: 404 });
  }

  const policyName = handle.replace(/-([a-z])/g, (_: unknown, m1: string) =>
    m1.toUpperCase()
  );

  const { shop } = (await query(POLICY_CONTENT_QUERY, {
    privacyPolicy: false,
    shippingPolicy: false,
    termsOfService: false,
    refundPolicy: false,
    [policyName]: true,
  })) as any;

  const policy = shop?.[policyName];

  if (!policy) {
    throw new Response(null, { status: 404 });
  }

  return json({ policy });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data?.policy?.title ?? "Policies",
  };
};

export default function Policies() {
  const { policy } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="fox-green montagu text-3xl mb-8">{policy.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: policy.body }} />
    </>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesQuery(
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;
