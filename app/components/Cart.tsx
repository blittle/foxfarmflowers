import { Link } from "@remix-run/react";
import {
  useCart,
  Image,
  ProductPrice,
  CartCheckoutButton,
  ShopPayButton,
} from "@shopify/storefront-kit-react";
import { useCallback } from "react";

export default function Cart({
  showCart,
  setShowCart,
}: {
  showCart: boolean;
  setShowCart: (cartStatus: boolean) => void;
}) {
  const { lines, linesRemove, cost } = useCart();
  return (
    <>
      <div
        className="fixed w-full h-full max-w-lg right-0 top-0 z-20 py-12 flex justify-center bg-slate-50"
        style={{
          right: showCart ? 0 : "-100%",
          transition: "200ms ease-in right",
        }}
      >
        <div className="w-full cart-container ">
          <button
            onClick={() => setShowCart(false)}
            className="text-gray-600 absolute right-4 top-4 text-4xl"
          >
            X
          </button>
          <div className="px-12 h-full">
            <div className="mb-8 font-bold text-lg">Cart</div>
            {lines && lines.length ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                  {lines.map((line) => (
                    <div key={line!.id} className="flex mb-4">
                      <div>
                        <Image
                          data={line?.merchandise?.image}
                          widths={[112, 224]}
                          width="112"
                          height="112"
                        />
                      </div>
                      <div className="flex-1 ml-2">
                        <h3 className="font-bold">
                          {line?.merchandise?.product?.title}
                        </h3>
                        <div className="flex">
                          <CartLineQuantityAdjust line={line} />
                          <button
                            type="button"
                            className="flex items-center justify-center w-10 h-10 border rounded mt-2 ml-2"
                            onClick={() => linesRemove([line.id])}
                          >
                            <span className="sr-only">Remove</span>
                            <img src="/trash.svg" style={{ height: 24 }} />
                          </button>
                        </div>
                      </div>
                      <div>
                        ${line?.merchandise?.price?.amount * line?.quantity}
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="my-4" />{" "}
                <div className="flex mb-6">
                  <div className="flex-1 font-bold text-lg">Subtotal</div>
                  <div>${cost?.totalAmount?.amount}</div>
                </div>
                <div className="flex justify-center mb-4">
                  <CartCheckoutButton
                    className="bg-fox-green text-white"
                    style={{
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      borderRadius: "4px",
                      height: "42px",
                      width: "262px",
                    }}
                  >
                    Continue to checkout
                  </CartCheckoutButton>
                </div>
                <div className="flex justify-center mb-12">
                  <ShopPayButton
                    variantIdsAndQuantities={lines.map((line) => ({
                      id: line?.merchandise?.id,
                      quantity: line?.quantity,
                    }))}
                  ></ShopPayButton>
                </div>
              </div>
            ) : (
              <div className="text-center text-lg">
                <div className="mb-4">
                  Looks like you haven’t added anything yet, let’s get you
                  started!
                </div>
                <Link
                  className="bg-fox-green text-white rounded py-2 px-12"
                  onClick={() => setShowCart(false)}
                  to="/shop"
                >
                  Go to Shop
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CartLineQuantityAdjust({ line }: any) {
  return (
    <>
      <div className="inline-flex mt-2 items-center border rounded h-10">
        <CartLineQuantityAdjustButton
          cartLine={line}
          adjust="decrease"
          aria-label="Decrease quantity"
          className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <div className="px-2 text-center">{line.quantity}</div>
        <CartLineQuantityAdjustButton
          cartLine={line}
          adjust="increase"
          aria-label="Increase quantity"
          className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}

function CartLineQuantityAdjustButton(props: any) {
  const { status, linesRemove, linesUpdate } = useCart();
  const { cartLine, children, adjust, onClick, ...passthroughProps } = props;

  const handleAdjust = useCallback(() => {
    if (adjust === "remove") {
      linesRemove([cartLine.id]);
      return;
    }

    const quantity =
      adjust === "decrease" ? cartLine.quantity - 1 : cartLine.quantity + 1;

    if (quantity <= 0) {
      linesRemove([cartLine.id]);
      return;
    }

    linesUpdate([{ id: cartLine.id, quantity }]);
  }, [adjust, cartLine.id, cartLine.quantity, linesRemove, linesUpdate]);

  return (
    <button
      disabled={status !== "idle"}
      onClick={handleAdjust}
      {...passthroughProps}
    >
      {children}
    </button>
  );
}
