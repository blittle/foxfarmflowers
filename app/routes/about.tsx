export default function About() {
  return (
    <div className="text-center text-xl">
      <h1
        style={{
          backgroundColor: "#e79dab",
          fontFamily: "'Montagu Slab', serif",
          fontWeight: "300",
        }}
        className="text-2xl lg:text-3xl text-white py-16 px-4"
      >
        Fresh, Local Flowers from North Berwick, Maine
      </h1>

      <img
        className="object-cover lg:float-right w-full lg:w-3/5 xl:w-2/5 lg:ml-4 mt-6 mb-2"
        src="/raw-images/tearsa.webp"
        alt="Tearsa with flowers"
      />

      <h2 className="pt-4">Hi, I'm Tearsa, and I was raised on a farm.</h2>

      <p className="pt-4">
        A huge farm. A farm so big, that, comparatively, Fox Farm Flowers might
        be considered nothing more than a garden.
      </p>

      <p className="pt-4">
        I grew up, left the farm, and never thought I would look back. Farming
        was not for me. I did still plant a garden, and many of those gardens
        included a row of flowers from mixed seed packets. I had no idea what
        varieties were blooming without some researching (if I even bothered),
        but I did know that they were beautiful and the pollinators loved them.
      </p>

      <p className="pt-4">
        Many years and a family later, I was cutting some of my garden-grown
        flowers for an arrangement. The thought occurred to me that this could
        be something bigger. I could be growing more than just a row; I could be
        making this the next chapter of my life.
      </p>

      <p className="pt-4">
        A quick Google search led me to order a book all about flower farming. I
        cracked it open, feeling optimistic that I was about to find all the
        knowledge I needed to guide my future farmer goals. Upon finishing, I
        was more convinced than ever that I wanted to help bring fresh-cut,
        local flowers to my community, but I also realized my naivety in
        thinking one book could ever give me what I needed to run a small farm.
        Many books, classes, courses, research, and learning-as-I-go later, here
        we are.
      </p>

      <p className="pt-4">
        What started out as a simple idea to grow flowers has become a rabbit
        hole into soil microbiology, regenerative practices, native plant
        benefits, plant varieties, deer-proofing, boulder excavating, digging,
        shoveling, wheelbarrow-ing, lots of sweat, and much more. And while Fox
        Farm Flowers is still very much in an adolescent state, I'm confident it
        will continue to provide challenges, rewards, and many blooms to come.
      </p>

      <p className="pt-4">
        I would love for you to join me as I seek to provide Maine-grown flowers
        to our community. Join the newsletter to hear about when and what
        flowers are in season, farm updates, and opportunities to visit Fox Farm
        Flowers in the future.
      </p>

      <p className="pt-4">
        Fox Farm Flowers is located on a 6 acre farm in North Berwick, ME and
        seeks to provide regeneratively grown, fresh, long-lasting, local
        flowers to the community.
      </p>

      <div className="grid grid-cols-2 grid-rows-2 mt-8 lg:mt-32 md:gap-4">
        <img
          className="object-cover w-full h-full"
          src="/raw-images/farm-1.webp"
          alt="Photo of the farm"
        />
        <img
          className="object-cover w-full h-full"
          src="/raw-images/farm-2.webp"
          alt="Photo of the farm"
        />
        <img
          className="object-cover w-full h-full"
          src="/raw-images/farm-3.webp"
          alt="Photo of the farm"
        />
        <img
          className="object-cover w-full h-full"
          src="/raw-images/farm-4.webp"
          alt="Photo of the farm"
        />
      </div>

      <div className="flex justify-center">
        <img
          className="object-cover w-16 my-12"
          src="/logo-flower.webp"
          alt="Photo of the farm"
        />
      </div>
    </div>
  );
}
