import { json, LoaderArgs, MetaFunction } from "@remix-run/cloudflare";
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

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Fox Farm Flowers",
  viewport: "width=device-width,initial-scale=1",
  description: "Fresh, Local Flowers from North Berwick, Maine",

  "og:type": "website",
  "og:url": "https://www.foxfarmflowers.com",
  "og:title": "Fox Farm Flowers",
  "og:description": "Fresh, Local Flowers from North Berwick, Maine",
  "og:image": "https://www.foxfarmflowers.com/raw-images/tearsa.webp",

  "twitter:card": "summary_large_image",
  "twitter:url": "https://www.foxfarmflowers.com",
  "twitter:title": "Fox Farm Flowers",
  "twitter:description": "Fresh, Local Flowers from North Berwick, Maine",
  "twitter:image": "https://www.foxfarmflowers.com/raw-images/tearsa.webp",
});

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
  return (
    <html lang="en">
      <head>
        <Partytown forward={["dataLayer.push"]} />
        <Meta />
        <Links />
      </head>
      <body style={{ fontFamily: "'Quicksand', sans-serif" }}>
        {/* <div
          className="w-full text-center text-white py-2"
          style={{ backgroundColor: "#dca0ab" }}
        >
          <Link className="hover:underline" to="/shop">
            Flower CSA Preorder Now Open!
          </Link>
        </div> */}
        <div className="fox-container mx-auto">
          <ShopHeader />
          <Outlet />
        </div>
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
      </body>
    </html>
  );
}
