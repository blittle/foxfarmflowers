import { NewsLetterForm } from "~/components/NewsLetterForm";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/css/shop.css",
    },
  ];
}

export default function Shop() {
  return (
    <div className="grid-container">
      <div className="grid-header py-16 lg:py-24 px-2 lg:px-64 text-center">
        <h1 className="text-4xl lg:text-5xl">
          Flowers will be available for purchase beginning in spring
        </h1>
        <h2 className="mt-12 lg:mt-24 text-2xl">
          Sign up to be the first to hear <br /> about our blooms and farm
          updates
        </h2>
        <div className="flex justify-center">
          <NewsLetterForm />
        </div>
      </div>
      <img
        className="grid-image-left object-cover"
        src="images/flowers-5.jpg"
        alt="flowers"
      />
      <img
        className="grid-image-middle object-cover"
        src="images/flowers-6.jpg"
        alt="flowers"
      />
      <img
        className="grid-image-right object-cover"
        src="images/flowers-7.jpg"
        alt="flowers"
      />
    </div>
  );
}
