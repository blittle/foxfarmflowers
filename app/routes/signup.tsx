import { ActionArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession, commitSession } from "../sessions";

type NewsLetterFormType = {
  returnTo: string;
};

export function NewsLetterForm({ returnTo }: NewsLetterFormType) {
  const [email, setEmail] = useState("");
  const { signup, signup_error } = useLoaderData();

  return (
    <Form
      method="post"
      action="/signup"
      className="mt-8 lg:mt-16 relative w-full lg:w-96"
    >
      {signup ? (
        <p className="text-center">Thanks for subscribing!</p>
      ) : signup_error ? (
        <p data-error className="text-center text-red-800">
          Error signing up! Please try again later.
        </p>
      ) : null}
      {!signup && !signup_error ? (
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

  try {
    await fetch("https://api.sendgrid.com/v3/marketing/contacts", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contacts: [{ email }],
      }),
    }).then(async (resp) => {
      if (resp.ok) return;
      else {
        const json = await resp.json();
        throw new Error(
          `${resp.status} ${resp.statusText}: ${JSON.stringify(json)}`
        );
      }
    });
    session.flash("signup", "success");
  } catch (e) {
    console.error("Error signing up user: " + (e as Error).message);
    console.log("----------EMAIL MESSAGE----------");
    console.log("Email:   ", email);
    console.log("---------------------------------");
    session.flash("signup_error", "true");
  }
  return redirect(returnTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
