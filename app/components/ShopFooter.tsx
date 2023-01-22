export function ShopFooter() {
  return (
    <>
      <div className="flex justify-center mt-12">
        <img
          className="object-cover w-16"
          src="/logo-flower.webp"
          alt="Photo of the farm"
        />
      </div>
      <div
        className="w-full text-gray-300 py-6 px-4 text-center"
        style={{ backgroundColor: "#004530" }}
      >
        <div className="flex justify-center mb-4">
          <a
            href="https://www.facebook.com/foxfarmflowersofmaine"
            target="_blank"
            aria-label="Facebook"
          >
            <img
              className="inline mr-4"
              style={{ height: 24 }}
              src="/facebook-white.svg"
            />
          </a>
          <a
            href="https://www.instagram.com/foxfarmflowersofmaine/"
            target="_blank"
            aria-label="Instagram"
          >
            <img
              className="inline"
              style={{ height: 24 }}
              src="/instagram-white.svg"
            />
          </a>
        </div>
        <div>
          Fox Farm Flowers LLC ⓒ2023 • North Berwick, Maine •{" "}
          <a href="/privacy.html">Privacy Policy</a>
        </div>
      </div>
    </>
  );
}
