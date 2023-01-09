import type { MetaFunction } from "@remix-run/cloudflare";
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
        <Meta />
        <Links />
      </head>
      <body style={{ fontFamily: "'Quicksand', sans-serif" }}>
        <div className="container mx-auto">
          <ShopHeader />
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
