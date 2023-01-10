import { ActionArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession, commitSession } from "../sessions";

type NewsLetterFormType = {
  returnTo: string;
};

export function NewsLetterForm({ returnTo }: NewsLetterFormType) {
  const [email, setEmail] = useState("");

  const { signup } = useLoaderData();

  return (
    <Form
      method="post"
      action="/signup"
      className="mt-16 relative w-full lg:w-96"
    >
      {signup ? (
        signup === "success" ? (
          <p className="text-center">Thanks for subscribing!</p>
        ) : (
          <p data-error className="text-center">
            {signup}
          </p>
        )
      ) : null}
      {!signup ? (
        <>
          <input type="hidden" value={returnTo} name="returnTo" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-white rounded-sm h-4 py-6 px-8 w-full text-gray-600 border-gray-600 border-1"
          />
          <button
            className="absolute right-6 top-4"
            type="submit"
            aria-label="Submit"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 ml-2 -mr-1"
              fill="gray"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </>
      ) : null}
    </Form>
  );
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const data = await request.formData();

  const returnTo = (data.get("returnTo") as string) || "/";
  const email = data.get("email");
  console.log(email);
  session.flash("signup", "success");
  return redirect(returnTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
