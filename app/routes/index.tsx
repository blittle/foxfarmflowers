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
    <div className="grid-container">
      <div
        style={{ backgroundColor: "#e79dab" }}
        className="top flex flex-col text-center px-8 pb-8 lg:pb-0 lg:flex-row lg:px-0 lg:text-left"
      >
        <div className="text-white flex-1 flex justify-center items-center flex-col pb-8">
          <img className="w-96" src="flowers-type.png" alt="flowers" />
          <h2 className="uppercase text-5xl">Coming this spring!</h2>
          <h3 className="text-center text-2xl mt-4 lg:mt-16 lg:px-32">
            Join our newsletter be the first to hear about our blooms and farm
            updates
          </h3>
          <NewsLetterForm returnTo="/" />
        </div>
        <img
          className="object-cover w-4/12 hidden lg:inline"
          src="/raw-images/flowers-1.webp"
          alt="flowers"
        />
      </div>
      <img
        className="flower-main object-cover lg:hidden h-full"
        src="/raw-images/flowers-1.webp"
        alt="flowers"
      />
      <img
        className="middle-left object-cover h-full"
        src="/raw-images/flowers-2.webp"
        alt="flowers"
      />
      <img
        className="middle-right object-cover h-full"
        src="/raw-images/flowers-3.webp"
        alt="flowers"
      />
      <img
        className="bottom object-cover h-full"
        src="/raw-images/flowers-4.webp"
        alt="flowers"
      />
    </div>
  );
}
