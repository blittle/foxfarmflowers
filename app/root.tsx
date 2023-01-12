import type { MetaFunction } from "@remix-run/cloudflare";
import { Partytown } from "@builder.io/partytown/react";
import styles from "./styles/app.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ShopHeader } from "./components/ShopHeader";
import { ShopFooter } from "./components/ShopFooter";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Fox Farm Flowers",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.png",
    },
    { rel: "stylesheet", href: styles },
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
      href: "https://fonts.googleapis.com/css2?family=Montagu+Slab:opsz@16..144&family=Quicksand:wght@500;600&display=swap",
    },
  ];
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
        <div className="container mx-auto">
          <ShopHeader />
          <Outlet />
          <ShopFooter />
        </div>
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
