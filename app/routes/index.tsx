import { json, LoaderArgs } from "@remix-run/cloudflare";
import { NewsLetterForm } from "./signup";
import { getSession, commitSession } from "../sessions";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/css/home.css",
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

export default function Index() {
  return (
    <div>
      <img
        className="w-full hidden lg:block"
        style={{ height: 279 }}
        src="https://cdn.shopify.com/s/files/1/0712/2911/2602/files/Home-Page-Collage_1024x278.jpg?v=1675020208"
      />
      <div className="text-center">
        <h1 className="montagu text-4xl lg:text-5xl fox-green mt-4 lg:mt-12 mb-2 lg:mb-4">
          Welcome to <br className="lg:hidden" /> Fox Farm Flowers
        </h1>
        <h2 className="uppercase lg:text-xl lg:font-bold px-4">
          A cut flower farm in North Berwick, Maine
        </h2>
      </div>
      <div className="relative mt-12">
        <img
          className="w-full hidden lg:block"
          style={{ height: 682 }}
          src="https://cdn.shopify.com/s/files/1/0712/2911/2602/files/Web_version_1024x682.jpg?v=1675020340"
        />
        <img
          className="w-full lg:hidden"
          src="https://cdn.shopify.com/s/files/1/0712/2911/2602/files/Mobile_800x800.jpg?v=1675020210"
        />
        <div
          className="absolute bottom-24 left-16 text-center hidden lg:block"
          style={{ width: 300 }}
        >
          <div className="montagu text-5xl fox-green" style={{ fontSize: 42 }}>
            2023 Bouquet CSA Preorder is Now Open!
          </div>
          <a
            className="rounded mt-4 py-2 bg-fox-green text-white block"
            href="/shop"
          >
            Shop Now
          </a>
        </div>
        <div
          className="absolute bottom-16 left-8 text-center lg:hidden"
          style={{ width: 190 }}
        >
          <div className="montagu text-5xl fox-green" style={{ fontSize: 26 }}>
            2023 Bouquet CSA Preorder is Now Open!
          </div>
          <a
            className="rounded mt-4 py-2 bg-fox-green text-white block"
            href="/shop"
          >
            Shop Now
          </a>
        </div>
      </div>

      <div className="flex flex-col justify-center mt-8 items-center px-4 lg:text-xl">
        <div className="font-bold -mb-2 lg:-mb-6 text-center montagu">
          Join our newsletter to be the first to hear about our blooms and farm
          updates:
        </div>
        <NewsLetterForm returnTo="/" />
      </div>
      <div className="mt-12">
        <img
          className="w-1/3 inline-block hidden lg:inline"
          src="https://cdn.shopify.com/s/files/1/0712/2911/2602/files/PXL_20220909_154405194_341x341.jpg?v=1675020208"
        />
        <img
          className="w-1/2 lg:w-1/3 inline-block"
          src="https://cdn.shopify.com/s/files/1/0712/2911/2602/files/PXL_20221209_141838497.MP_341x341.jpg?v=1675020206"
        />
        <img
          className="w-1/2 lg:w-1/3 inline-block"
          src="https://cdn.shopify.com/s/files/1/0712/2911/2602/files/PXL_20230120_162546212.PORTRAIT_341x341.jpg?v=1675020211"
        />
      </div>
    </div>
  );
}
