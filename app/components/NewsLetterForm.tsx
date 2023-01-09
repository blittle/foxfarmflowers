import { useState } from "react";

export function NewsLetterForm() {
  const [email, setEmail] = useState("");

  return (
    <form className="mt-16 relative w-full lg:w-96">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL"
        className="bg-white rounded-sm h-4 py-6 px-8 w-full text-gray-600 border-gray-600 border-1"
      />
      <button className="absolute right-6 top-4">
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
    </form>
  );
}
