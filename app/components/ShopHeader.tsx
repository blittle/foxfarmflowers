import { Link } from "@remix-run/react";
import { useCart } from "@shopify/storefront-kit-react";
import { useEffect, useState } from "react";
import Cart from "./Cart";

export function ShopHeader({
  showCart,
  setShowCart,
}: {
  showCart: boolean;
  setShowCart: (cartStatus: boolean) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const { totalQuantity, status } = useCart();

  return (
    <>
      <Cart showCart={showCart} setShowCart={setShowCart} />
      <div className="hidden lg:flex justify-center items-end uppercase text-gray-500 font-semibold mb-12 mt-2 relative">
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
        <button
          className="absolute right-0 top-8"
          onClick={() => setShowCart(true)}
        >
          <img src="/cart.svg" className="w-6" />
          {status !== "uninitialized" && status !== "fetching" ? (
            <div className="bg-fox-green text-white w-4 h-4 rounded-full absolute text-sm leading-none top-4 right-0">
              {totalQuantity}
            </div>
          ) : null}
        </button>
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
        <Link to="/" aria-label="Home">
          <img
            className="mr-16 relative top-4"
            style={{ height: 108 }}
            src="/ffflogo.webp"
          />
        </Link>
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
        <div className="fixed lg:hidden w-full bg-white z-10 relative">
          <button
            className="space-y-2 absolute left-6 top-8"
            onClick={() => setShowMenu(true)}
          >
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
          </button>
          <div className="flex items-center justify-center w-full pt-4">
            <Link to="/" aria-label="Home">
              <img style={{ height: 66 }} src="/ffflogo-mobile.webp" />
            </Link>
          </div>
          <button
            className="absolute right-4 top-6"
            onClick={() => setShowCart(true)}
          >
            <img src="/cart.svg" className="w-6" />
            {status !== "uninitialized" && status !== "fetching" ? (
              <div className="bg-fox-green text-white w-4 h-4 rounded-full absolute text-sm leading-none top-4 right-0">
                {totalQuantity}
              </div>
            ) : null}
          </button>
        </div>
      </div>
      {
        <div
          className="fixed w-full left-0 top-0 z-10 bg-white text-center"
          style={{
            top: showMenu ? 0 : "-100%",
            transition: "200ms ease-in top",
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
              className="h-20 text-2xl flex flex-col justify-center border-b-2 border-white"
              to="/"
            >
              Home
            </Link>
            <Link
              className="h-20 text-2xl flex flex-col justify-center border-b-2 border-white"
              to="/about"
            >
              About
            </Link>
            <Link
              className="h-20 text-2xl flex flex-col justify-center border-b-2 border-white"
              to="/contact"
            >
              Contact
            </Link>
            <Link
              className="h-20 text-2xl flex flex-col justify-center border-b-2 border-white"
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
