import { ActionArgs, LoaderArgs, redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { json } from "react-router";
import { getSession, commitSession } from "../sessions";

const adminEmail = "tearsa@foxfarmflowers.com";

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

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const { signup, signup_error } = useLoaderData();

  return (
    <div>
      <img
        className="object-cover"
        src="/raw-images/flowers-8.webp"
        alt="flowers"
      />
      <h1
        className="text-center text-4xl mt-16 font-normal"
        style={{ color: "#004530", fontFamily: "'Montagu Slab', serif" }}
      >
        We would love to hear from you!
      </h1>
      <h2 className="text-center text-xl mt-8 text-gray-500 px-4">
        If you have questions or comments, please get in touch.
      </h2>

      {signup ? (
        <h3
          className="text-center text-xl mt-16 font-normal "
          style={{ color: "#004530", fontFamily: "'Montagu Slab', serif" }}
        >
          Thank you, we'll get back to you soon!
        </h3>
      ) : signup_error ? (
        <h3
          className="text-center text-xl mt-16 font-normal text-red-700"
          style={{ fontFamily: "'Montagu Slab', serif" }}
        >
          Error sending comment. Please try again later!
        </h3>
      ) : (
        <Form
          className="mt-16 flex justify-center"
          method="post"
          action="/contact"
        >
          <div className="w-10/12 lg:w-1/2">
            <div className="flex flex-col lg:flex-row">
              <input
                type="text"
                value={name}
                name="name"
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="flex-1 bg-white rounded-sm h-4 py-6 px-8 w-full text-gray-600 border-gray-300 border mr-4 mb-4 lg:mb-0"
              />
              <input
                type="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 bg-white rounded-sm h-4 py-6 px-8 w-full text-gray-600 border-gray-300 border"
              />
            </div>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-1 bg-white rounded-sm height-8 lg:height-4 py-6 px-8 w-full text-gray-600 border-gray-300 border mt-4"
            />
            <textarea
              required
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment"
              className="flex-1 bg-white rounded-sm py-6 px-8 w-full text-gray-600 border-gray-300 border mt-4"
            />
            <button
              className="text-white px-12 py-4 rounded-3xl hover:brightness-75 mt-8 w-full lg:w-auto"
              style={{ backgroundColor: "#004530" }}
            >
              Send
            </button>
          </div>
        </Form>
      )}
      <div
        style={{
          backgroundColor: "#e79dab",
          fontFamily: "'Montagu Slab', serif",
        }}
        className="p-16 text-white mt-16 text-3xl text-center font-normal"
      >
        Follow along! <br />
        <div className="mt-4">
          <a
            href="https://www.facebook.com/foxfarmflowersofmaine"
            target="_blank"
            aria-label="Facebook"
          >
            <img className="inline mr-4" src="/facebook.svg" />
          </a>
          <a
            href="https://www.instagram.com/foxfarmflowersofmaine/"
            target="_blank"
            aria-label="Instagram"
          >
            <img className="inline" src="/instagram.svg" />
          </a>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const data = await request.formData();

  const name = data.get("name");
  const email = data.get("email");
  const phone = data.get("phone");
  const comment = data.get("comment");

  try {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_id: "d-dd72664a6765465780421e3d6adc9f9f",
        personalizations: [
          {
            to: [{ email: adminEmail }],
            dynamic_template_data: {
              name,
              phone,
              comment,
              email,
            },
          },
        ],
        from: { email: adminEmail },
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
    console.error("Error sending contact email: " + (e as Error).message);
    console.log("----------EMAIL MESSAGE----------");
    console.log("Name:    ", name);
    console.log("Email:   ", email);
    console.log("Phone:   ", phone);
    console.log("Comment: ", comment);
    console.log("---------------------------------");
    session.flash("signup_error", "true");
  }

  return redirect("/contact", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
