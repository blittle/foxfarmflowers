import { Link } from "@remix-run/react";
import { useState } from "react";

export function ShopHeader() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <div className="hidden lg:flex justify-center items-end uppercase text-gray-500 font-semibold mb-24 relative">
        <div className="absolute left-0 top-8">
          <a
            href="https://www.facebook.com/foxfarmflowersofmaine"
            target="_blank"
            aria-label="Facebook"
          >
            <img className="inline mr-4 w-6" src="/facebook.svg" />
          </a>
          <a
            href="https://www.instagram.com/foxfarmflowersofmaine/"
            target="_blank"
            aria-label="Instagram"
          >
            <img className="inline w-6" src="/instagram.svg" />
          </a>
        </div>
        <Link
          className="mr-16 ease-in hover:text-gray-700 hover:underline"
          to="/"
        >
          Home
        </Link>
        <Link
          className="mr-16 ease-in hover:text-gray-700 hover:underline"
          to="/about"
        >
          About
        </Link>
        <a href="/" aria-label="Home">
          <img
            className="mr-16 relative top-6"
            style={{ height: 160 }}
            src="/ffflogo.webp"
          />
        </a>
        <Link
          className="mr-16 ease-in hover:text-gray-700 hover:underline"
          to="/contact"
        >
          Contact
        </Link>
        <Link
          className="ease-in hover:text-gray-700 hover:underline"
          to="/shop"
        >
          Shop
        </Link>
      </div>
      <div className="h-24 lg:h-0">
        <div className="fixed lg:hidden w-full bg-white z-10">
          <div className="flex items-center justify-evenly">
            <a href="/" aria-label="Home">
              <img style={{ height: 86 }} src="/ffflogo-mobile.webp" />
            </a>
            <button className="space-y-2" onClick={() => setShowMenu(true)}>
              <div className="w-8 h-0.5 bg-gray-600"></div>
              <div className="w-8 h-0.5 bg-gray-600"></div>
              <div className="w-8 h-0.5 bg-gray-600"></div>
            </button>
          </div>
        </div>
      </div>
      {
        <div
          className="fixed w-3/4 h-full top-0 z-10"
          style={{
            backgroundColor: "#e79dab",
            right: showMenu ? 0 : "-75%",
            transition: "200ms ease-in right",
          }}
        >
          <button
            onClick={() => setShowMenu(false)}
            className="text-gray-600 absolute right-4 top-4 text-4xl"
          >
            X
          </button>
          <div className="flex flex-col" onClick={() => setShowMenu(false)}>
            <Link
              className="h-20 text-2xl text-white flex flex-col justify-center pl-8 border-b-2 border-white"
              to="/"
            >
              Home
            </Link>
            <Link
              className="h-20 text-2xl text-white flex flex-col justify-center pl-8 border-b-2 border-white"
              to="/about"
            >
              About
            </Link>
            <Link
              className="h-20 text-2xl text-white flex flex-col justify-center pl-8 border-b-2 border-white"
              to="/contact"
            >
              Contact
            </Link>
            <Link
              className="h-20 text-2xl text-white flex flex-col justify-center pl-8 border-b-2 border-white"
              to="/shop"
            >
              Shop
            </Link>
          </div>
        </div>
      }
    </>
  );
}
