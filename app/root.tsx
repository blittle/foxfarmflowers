import { json, LoaderArgs, V2_MetaFunction } from "@remix-run/cloudflare";
import { Partytown } from "@builder.io/partytown/react";
import styles from "./styles/app.css";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ShopHeader } from "./components/ShopHeader";
import { ShopFooter } from "./components/ShopFooter";
import { commitSession, getSession } from "./sessions";
import { CartProvider, ShopifyProvider } from "@shopify/storefront-kit-react";
import { config } from "./shop-client";
import { useState } from "react";

export const meta: V2_MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "Fox Farm Flowers" },
    { viewport: "width=device-width,initial-scale=1" },
    { description: "Fresh, Local Flowers from North Berwick, Maine" },

    {
      "og:type": "website",
      "og:url": "https://www.foxfarmflowers.com",
      "og:title": "Fox Farm Flowers",
      "og:description": "Fresh, Local Flowers from North Berwick, Maine",
      "og:image": "https://www.foxfarmflowers.com/raw-images/tearsa.webp",
    },

    {
      "twitter:card": "summary_large_image",
      "twitter:url": "https://www.foxfarmflowers.com",
      "twitter:title": "Fox Farm Flowers",
      "twitter:description": "Fresh, Local Flowers from North Berwick, Maine",
      "twitter:image": "https://www.foxfarmflowers.com/raw-images/tearsa.webp",
    },
  ];
};

export function links() {
  return [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.png",
    },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: "/css/root.css" },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Montagu+Slab:opsz@16..144&family=Quicksand:wght@400;500;600&display=swap",
    },
  ];
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return json(
    {
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

export default function App() {
  const [showCart, setShowCart] = useState(false);
  return (
    <html lang="en">
      <head>
        <Partytown
          forward={["dataLayer.push", "fbq"]}
          resolveUrl={(url) => {
            if (url.hostname === "connect.facebook.net") {
              var proxyUrl = new URL("https://foxfarmflowers.com/f");
              proxyUrl.searchParams.append("url", url.href);
              return proxyUrl;
            }
            return url;
          }}
        />
        <Meta />
        <Links />
        <meta
          name="facebook-domain-verification"
          content="9ul2ik2bsht3wqcncui8rwyb19nc0o"
        />
      </head>
      <body style={{ fontFamily: "'Quicksand', sans-serif" }}>
        {/* <div
          className="w-full text-center text-white py-2"
          style={{ backgroundColor: "#dca0ab" }}
        >
          <Link className="hover:underline" to="/products/mothers-day-bouquets">
            Mother's Day Bouquets Now Available!
          </Link>
        </div> */}
        <ShopifyProvider shopifyConfig={config}>
          <CartProvider
            onLineAdd={(e) => {
              fbq("track", "AddToCart");
              setShowCart(true);
            }}
            onCreateComplete={() => setShowCart(true)}
          >
            <div className="fox-container mx-auto">
              <ShopHeader showCart={showCart} setShowCart={setShowCart} />
              <Outlet />
            </div>
          </CartProvider>
        </ShopifyProvider>
        <ShopFooter />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          type="text/partytown"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SJ28M7GTM6"
        ></script>
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-SJ28M7GTM6');
            `,
          }}
        />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1250981829109535');
fbq('track', 'PageView');`,
          }}
        ></script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1250981829109535&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
