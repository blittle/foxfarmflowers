import { Link } from "@remix-run/react";
import {
  useCart,
  Image,
  ProductPrice,
  CartCheckoutButton,
  ShopPayButton,
} from "@shopify/storefront-kit-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Cart({
  showCart,
  setShowCart,
}: {
  showCart: boolean;
  setShowCart: (cartStatus: boolean) => void;
}) {
  const shopPayRef = useRef();
  let {
    attributes = [],
    lines,
    linesRemove,
    cost,
    cartAttributesUpdate,
    checkoutUrl,
  } = useCart();

  const [isGift, setIsGift] = useState(false);

  useEffect(() => {
    setIsGift(
      attributes && attributes.length
        ? attributes[0].key === "isGift" && attributes[0].value === "true"
        : false
    );

    setRecipientName(
      (
        attributes.find((attribute) => attribute.key === "recipientName") || {
          value: "",
        }
      ).value
    );

    setRecipientEmail(
      (
        attributes.find((attribute) => attribute.key === "recipientEmail") || {
          value: "",
        }
      ).value
    );

    setRecipientPhone(
      (
        attributes.find((attribute) => attribute.key === "recipientPhone") || {
          value: "",
        }
      ).value
    );
  }, [attributes]) && useState();

  function updateGiftStatus() {
    const newGiftState = !isGift;
    setIsGift(!newGiftState);

    if (newGiftState) {
      cartAttributesUpdate([{ key: "isGift", value: "true" }]);
    } else {
      cartAttributesUpdate([{ key: "isGift", value: "false" }]);
    }
  }

  const [recipientName, setRecipientName] = useState("");
  const [recipientNameValid, setRecipientNameValid] = useState(true);

  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientPhoneValid, setRecipientPhoneValid] = useState(true);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientEmailValid, setRecipientEmailValid] = useState(true);

  const checkoutEnabled =
    !isGift || (recipientEmail && recipientName && recipientPhone);

  useEffect(() => {
    if (shopPayRef.current) {
      setTimeout(() => {
        const shopPayButton =
          shopPayRef.current.querySelector("shop-pay-button");
        if (shopPayButton) {
          if (checkoutEnabled) shopPayButton.removeAttribute("disabled");
          else shopPayButton.setAttribute("disabled", true);
        }
      }, 100);
    }
  }, [attributes, checkoutEnabled]);

  return (
    <>
      <div
        className="fixed w-full h-full max-w-lg right-0 top-0 z-20 py-4 md:py-12 flex justify-center bg-slate-50"
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
          <div className="px-4 md:px-12 h-full">
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
                        {line?.merchandise?.selectedOptions?.length ? (
                          <h3 className="">
                            {line?.merchandise?.selectedOptions[0]?.value !==
                            "Default Title"
                              ? line?.merchandise?.selectedOptions[0]?.value
                              : ""}
                          </h3>
                        ) : null}
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
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={updateGiftStatus}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium">
                    Is this a gift?
                  </span>
                </label>
                {isGift && (
                  <div>
                    <p className="my-4 text-xs">
                      Fresh local flowers are a fantastic gift! Provide us with
                      your recipient's name and contact information, and we will
                      send you an email with a printable (or email-able) card
                      for you to pass along. Don't worry about us ruining any
                      surprises...we won't contact your recipient with reminders
                      and details UNTIL it gets close to bouquet pick up time.
                    </p>
                    <div className="flex flex-col">
                      <input
                        type="text"
                        required
                        placeholder="Recipient name"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        onBlur={() => {
                          attributes = attributes.filter(
                            (attribute) => attribute.key !== "recipientName"
                          );
                          if (recipientName) {
                            attributes?.push({
                              key: "recipientName",
                              value: recipientName,
                            });
                            setRecipientNameValid(true);
                          } else {
                            setRecipientNameValid(false);
                          }
                          cartAttributesUpdate(attributes);
                        }}
                        className={`rounded py-2 px-4 border-2 ${
                          !recipientNameValid
                            ? "border-red-600 placeholder-red-600"
                            : ""
                        }`}
                      />
                      <input
                        type="email"
                        required
                        placeholder="Recipient email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        onBlur={() => {
                          attributes = attributes.filter(
                            (attribute) => attribute.key !== "recipientEmail"
                          );
                          if (recipientEmail) {
                            attributes.push({
                              key: "recipientEmail",
                              value: recipientEmail,
                            });
                            setRecipientEmailValid(true);
                          } else {
                            setRecipientEmailValid(false);
                          }

                          cartAttributesUpdate(attributes);
                        }}
                        className={`rounded py-2 px-4 my-4 border-2 ${
                          !recipientEmailValid
                            ? "border-red-600 placeholder-red-600"
                            : ""
                        }`}
                      />
                      <input
                        type="phone"
                        required
                        placeholder="Recipient phone"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        onBlur={() => {
                          attributes = attributes.filter(
                            (attribute) => attribute.key !== "recipientPhone"
                          );
                          if (recipientPhone) {
                            attributes.push({
                              key: "recipientPhone",
                              value: recipientPhone,
                            });
                            setRecipientPhoneValid(true);
                          } else {
                            setRecipientPhoneValid(false);
                          }

                          cartAttributesUpdate(attributes);
                        }}
                        className={`rounded py-2 px-4 border-2 ${
                          !recipientPhoneValid
                            ? "border-red-600 placeholder-red-600"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                )}
                <hr className="my-4" />{" "}
                <div className="flex mb-6">
                  <div className="flex-1 font-bold text-lg">Subtotal</div>
                  <div>${cost?.totalAmount?.amount}</div>
                </div>
                <div className="flex justify-center mb-4">
                  <button
                    onClick={(e) => {
                      if (!checkoutEnabled) {
                        if (!recipientEmail) setRecipientEmailValid(false);
                        if (!recipientName) setRecipientNameValid(false);
                        if (!recipientPhone) setRecipientPhoneValid(false);
                        e.preventDefault();
                      } else {
                        fbq("track", "InitiateCheckout");
                        window.location.href = checkoutUrl;
                      }
                    }}
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
                  </button>
                </div>
                <div className="flex justify-center mb-12" ref={shopPayRef}>
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
