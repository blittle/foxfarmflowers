import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { query } from "~/shop-client";

export async function loader({ context: { storefront } }: LoaderArgs) {
  const { shop } = (await query(POLICIES_QUERY)) as any;

  const policies = Object.values(shop || {});

  if (policies.length === 0) {
    throw new Response("Not found", { status: 404 });
  }

  return json({
    policies,
  });
}

export default function Policies() {
  const { policies } = useLoaderData<typeof loader>();

  return (
    <>
      {policies.map((policy) => {
        return (
          policy && (
            <Link
              className="block mt-8 text-xl font-bold"
              to={`/policies/${policy.handle}`}
              key={policy.handle}
            >
              {policy.title}
            </Link>
          )
        );
      })}
    </>
  );
}

const POLICIES_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    id
    title
    handle
  }

  query PoliciesQuery {
    shop {
      privacyPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;
