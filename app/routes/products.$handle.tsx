import { json, LoaderArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { query } from "~/shop-client";
import {
  ProductPrice,
  Image,
  AddToCartButton,
  ProductProvider,
  flattenConnection,
} from "@shopify/storefront-kit-react";
import { RadioGroup } from "@headlessui/react";
import CSAFaq from "~/components/CSAFaq";
import {
  Metaobject,
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";

import {
  format,
  isValid,
  parse,
  differenceInCalendarMonths,
  differenceInCalendarDays,
} from "date-fns";
import FocusTrap from "focus-trap-react";
import { DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";
import styles from "react-day-picker/dist/style.css";

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ params }: LoaderArgs) {
  const { product, metaobjects } = (await query(PRODUCT_QUERY, {
    handle: params.handle,
  })) as any;

  return json({
    product,
    handle: params.handle,
    metaobjects: flattenConnection(metaobjects),
  });
}

function AddToCartVariant({
  variantId,
  product,
  label,
  disabled,
  pickupDate,
  pickupCartProperty,
}: {
  variantId: string;
  product: Product;
  label?: string;
  disabled?: boolean;
  pickupDate?: Date;
  pickupCartProperty?: string;
}) {
  const variant = product.variants.nodes.find(
    (variant) => variant.id === variantId
  );

  if (!variant) return null;

  const available = variant.availableForSale;

  return (
    <>
      <AddToCartButton
        type="button"
        disabled={disabled ?? !available}
        variantId={variantId}
        attributes={
          pickupDate
            ? [
                {
                  key: "pickupDate",
                  value: pickupCartProperty!,
                },
              ]
            : undefined
        }
        className={`bg-fox-green text-white rounded py-2 px-12 mt-4 lg:mt-8 ${
          (disabled ?? !available) && "opacity-50"
        }`}
      >
        {available ? (label ? label : "Add to cart") : "Sold out!"}
      </AddToCartButton>
    </>
  );
}

function SelectProductVariant({
  selectedVariantId,
  setSelectedVariantId,
  product,
  setPickupDate,
  setPickupCartProperty,
}: {
  selectedVariantId: string;
  setSelectedVariantId: React.Dispatch<React.SetStateAction<string>>;
  product: Product;
  setPickupDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setPickupCartProperty: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}) {
  const multipleVariants = product.variants.nodes.length > 1;

  if (!multipleVariants) return null;

  const deliveryMethods = product.variants.nodes.map((variant) => ({
    id: variant.id,
    title: variant.title + " Pickup",
  }));

  return (
    <div className="mt-6">
      <RadioGroup
        value={deliveryMethods.find(
          (method) => method.id === selectedVariantId
        )}
        onChange={(variant) => {
          setSelectedVariantId(variant.id);
          setPickupCartProperty(undefined);
          setPickupDate(undefined);
        }}
      >
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {deliveryMethods.map((deliveryMethod) => (
            <RadioGroup.Option
              key={deliveryMethod.id}
              value={deliveryMethod}
              className={({ checked, active }) =>
                classNames(
                  checked ? "border-transparent" : "border-gray-300",
                  active ? "ring-2 ring-fox-green" : "",
                  "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                )
              }
            >
              {({ checked, active }) => (
                <>
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className="block text-sm font-medium text-gray-900"
                      >
                        {deliveryMethod.title}
                      </RadioGroup.Label>
                    </span>
                  </span>
                  <span
                    className={classNames(
                      active ? "border" : "border-2",
                      checked ? "border-fox-green" : "border-transparent",
                      "pointer-events-none absolute -inset-px rounded-lg"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

function DatePickerDialog({
  pickupDates,
  pickupDate,
  setPickupDate,
  setPickupCartProperty,
  selectedVariant,
}: {
  pickupDates: Metaobject;
  pickupDate: Date | undefined;
  setPickupDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setPickupCartProperty: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedVariant?: ProductVariant;
}) {
  const today = new Date();
  const currentDayOfTheWeek = today.getDay();

  const availablePickupDates = pickupDates.fields
    .filter((field) => {
      return field.key !== "product" && field.key !== "unavailable";
    })
    .map((field) => {
      const [start, end] = JSON.parse(field.value!);
      const startDate = new Date(start);
      const endDate = new Date(end);

      return {
        start: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + (startDate.getDay() - today.getDay()),
          startDate.getHours()
        ),
        end: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + (endDate.getDay() - today.getDay()),
          endDate.getHours()
        ),
      };
    });

  const disabled = [];
  let dayIndex = 1;

  while (true) {
    const day = new Date(today.getFullYear(), today.getMonth(), dayIndex);
    if (Math.abs(differenceInCalendarMonths(day, today)) >= 2) break;

    const dayDiff = differenceInCalendarDays(day, today);
    if (dayDiff <= 14 && dayDiff >= 0) {
      const dayAvailable = availablePickupDates.find(
        (date) => date.start.getDay() === day.getDay()
      );

      if (!dayAvailable) {
        disabled.push(day);
      }
    } else {
      disabled.push(day);
    }

    dayIndex++;
  }

  const [inputValue, setInputValue] = useState<string>("");
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom-start",
  });

  const availableTimes = availablePickupDates.find(
    (date) => date.start.getDay() === pickupDate?.getDay()
  ) || { start: today, end: today };

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
    if (isValid(date)) {
      const dayAvailable = availablePickupDates.find(
        (d) => d.start.getDay() === date.getDay()
      );

      setPickupCartProperty(
        dayAvailable
          ? format(date, "MMMM dd, yyyy") +
              ", " +
              format(dayAvailable.start, "h:mm a") +
              " - " +
              format(dayAvailable.end, "h:mm a")
          : undefined
      );
      setPickupDate(date);
    } else {
      setPickupCartProperty(undefined);
      setPickupDate(undefined);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date?: Date) => {
    if (date) {
      const dayAvailable = availablePickupDates.find(
        (d) => d.start.getDay() === date.getDay()
      );

      setPickupCartProperty(
        dayAvailable
          ? format(date, "MMMM dd, yyyy") +
              ", " +
              format(dayAvailable.start, "h:mm a") +
              " - " +
              format(dayAvailable.end, "h:mm a")
          : undefined
      );
    } else setPickupCartProperty(undefined);
    setPickupDate(date);
    if (date) {
      setInputValue(format(date, "y-MM-dd"));
      closePopper();
    } else {
      setInputValue("");
    }
  };

  if (!availablePickupDates.length)
    return (
      <div>
        Unavailable this week in {selectedVariant?.title}. Please select a
        different location, check back next week, or{" "}
        <Link to="/contact">contact us</Link> with any specific requests.
      </div>
    );

  return (
    <div className="lg:flex">
      <div className="mb-6 lg:mb-0">
        <label htmlFor="pickup-date" className="font-medium block mb-2">
          Pickup date
        </label>
        <div ref={popperRef} className="relative">
          <input
            type="text"
            id="pickup-date"
            name="pickup-date"
            placeholder={"Select a pickup date"}
            value={inputValue}
            onChange={handleInputChange}
            onSelect={handleButtonClick}
            className="lg:w-auto w-full pr-8 rounded-md border-0 lg:py-1.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            ref={buttonRef}
            type="button"
            className="bg-white absolute right-2 top-2 bottom-2"
            aria-label="Pick a date"
            onClick={handleButtonClick}
          >
            <span role="img" aria-label="calendar icon">
              📅
            </span>
          </button>
        </div>
        {isPopperOpen && (
          <FocusTrap
            active
            focusTrapOptions={{
              initialFocus: false,
              allowOutsideClick: true,
              clickOutsideDeactivates: false,
              fallbackFocus: buttonRef?.current!,
            }}
          >
            <div
              tabIndex={-1}
              style={popper.styles.popper}
              className="bg-white shadow-lg rounded-lg p-4 z-10 relative"
              {...popper.attributes.popper}
              ref={setPopperElement}
              role="dialog"
              aria-label="DayPicker calendar"
            >
              <button
                onClick={closePopper}
                className="absolute right-2 top-2 cursor-pointer"
              >
                x
              </button>
              <DayPicker
                initialFocus={isPopperOpen}
                mode="single"
                selected={pickupDate}
                modifiersClassNames={{
                  disabled: "text-gray-400",
                  selected: "bg-fox-green text-white",
                }}
                onSelect={handleDaySelect}
                defaultMonth={today}
                fromMonth={today}
                toMonth={new Date(today.getFullYear(), today.getMonth() + 1)}
                disabled={disabled}
              />
            </div>
          </FocusTrap>
        )}
      </div>

      {pickupDate ? (
        <div className="lg:ml-6">
          <label htmlFor="pickup-time" className="font-medium block mb-2">
            Pickup time
          </label>
          <div>
            {format(availableTimes.start, "h:mm a")} -{" "}
            {format(availableTimes.end, "h:mm a")}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SelectDateTime({
  metaobjects,
  selectedVariantId,
  pickupDate,
  setPickupDate,
  setPickupCartProperty,
  product,
}: {
  metaobjects: Metaobject[];
  selectedVariantId: string;
  pickupDate: Date | undefined;
  setPickupDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setPickupCartProperty: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  product: Product;
}) {
  const pickupDates = metaobjects.find((obj) =>
    obj.fields.find(
      (field) => field.key === "product" && field.value === selectedVariantId
    )
  );

  const selectedVariant = product.variants.nodes.find(
    (variant) => variant.id === selectedVariantId
  );

  return (
    <div className="mt-6">
      {pickupDates ? (
        <DatePickerDialog
          pickupDates={pickupDates}
          pickupDate={pickupDate}
          setPickupDate={setPickupDate}
          selectedVariant={selectedVariant}
          setPickupCartProperty={setPickupCartProperty}
        />
      ) : null}
    </div>
  );
}

export default function ProductDetailPage() {
  const { product, metaobjects } = useLoaderData();
  const fullTitle = product.title;
  const isCSA = fullTitle.includes("CSA");
  const title = isCSA
    ? product.title.substring(0, product.title.indexOf("("))
    : fullTitle;

  const variantId = product.variants.nodes[0].id;

  const [selectedVariantId, setSelectedVariantId] = useState(variantId);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupCartProperty, setPickupCartProperty] = useState<string>();

  return (
    <>
      <ProductProvider data={product} initialVariantId={variantId}>
        <div className="flex lg:flex-row flex-col-reverse py-8 lg:pt-0">
          <div className="w-full lg:w-1/2 lg:pr-6 mt-4 lg:mt-0">
            <Image data={product.media.nodes[1].image} widths={[500]} />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-4 px-4 lg:pr-0 text-center lg:text-left">
            <h1 className="montagu text-2xl uppercase fox-green font-bold mb-2 lg:mb-8">
              {title}
            </h1>
            <ProductPrice data={product} variantId={variantId} />
            <SelectProductVariant
              selectedVariantId={selectedVariantId}
              setSelectedVariantId={setSelectedVariantId}
              setPickupDate={setPickupDate}
              setPickupCartProperty={setPickupCartProperty}
              product={product}
            />
            {!isCSA ? (
              <SelectDateTime
                selectedVariantId={selectedVariantId}
                metaobjects={metaobjects}
                pickupDate={pickupDate}
                product={product}
                setPickupDate={setPickupDate}
                setPickupCartProperty={setPickupCartProperty}
              />
            ) : null}
            <AddToCartVariant
              variantId={selectedVariantId}
              product={product}
              pickupDate={pickupDate}
              pickupCartProperty={pickupCartProperty}
              disabled={!isCSA ? !pickupDate : undefined}
            />
            <div
              className="product-description mt-8"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
        {isCSA ? <CSAFaq /> : null}
      </ProductProvider>
    </>
  );
}

const MEDIA_FRAGMENT = `
  fragment Media on Media {
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
`;

const PRODUCT_QUERY = `
  ${MEDIA_FRAGMENT}
  query Product(
    $handle: String!
  ) {
    metaobjects(type: "local_pickup_availability", first: 2) {
      nodes {
        type
        handle
        fields {
          key
          value
        }
      }
    }
    product(handle: $handle) {
      id
      title
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      productType
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;
