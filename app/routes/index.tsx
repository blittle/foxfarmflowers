import { useState } from "react";
import { NewsLetterForm } from "~/components/NewsLetterForm";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/css/home.css",
    },
  ];
}

export default function Index() {
  return (
    <div className="grid-container">
      <div
        style={{ backgroundColor: "#e79dab" }}
        className="top flex flex-col text-center px-8 pb-8 lg:pb-0 lg:flex-row lg:px-0 lg:text-left"
      >
        <div className="text-white flex-1 flex just-center items-center flex-col pt-8">
          <img className="w-96" src="images/flowers-type.png" alt="flowers" />
          <h2 className="uppercase text-5xl">Coming this spring!</h2>
          <h3 className="text-center text-2xl mt-16">
            Join our newsletter be the first to hear
            <br />
            about our blooms and farm updates
          </h3>
          <NewsLetterForm />
        </div>
        <img
          className="object-cover w-5/12 hidden lg:inline"
          src="images/flowers-1.jpg"
          alt="flowers"
        />
      </div>
      <img
        className="flower-main object-cover lg:hidden h-full"
        src="images/flowers-1.jpg"
        alt="flowers"
      />
      <img
        className="middle-left object-cover h-full"
        src="images/flowers-2.jpg"
        alt="flowers"
      />
      <img
        className="middle-right object-cover h-full"
        src="images/flowers-3.jpg"
        alt="flowers"
      />
      <img
        className="bottom object-cover h-full"
        src="images/flowers-4.jpg"
        alt="flowers"
      />
    </div>
  );
}
