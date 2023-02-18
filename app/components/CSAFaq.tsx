import { Link } from "@remix-run/react";
import { useState } from "react";

export default function CSAFaq() {
  return (
    <div>
      <h2 className="montagu text-2xl text-center fox-green font-bold mb-8 mt-8">
        CSA FAQ
      </h2>
      <div className="text-left px-4 lg:px-0">
        <FaqItem
          title="What is a CSA? How does this work?"
          details={`<p>Community Supported Agriculture, or CSA, is a farming model where the consumer (you!) can purchase “shares” of a farm’s harvest at the beginning of the season and then receive their portion at harvest time. Both the consumer and farmer share the risks and rewards of the land. This helps farmers pay for seeds and supplies at the beginning of the season and plan what and how much crops to grow. It also helps keep the focus on growing the best quality products during the growing season instead of using that time for marketing. CSAs are a great way to support local farmers and give yourself the freshest, in-season products available.
       </p><p style="margin-top:8px">(In a nutshell, you purchase a share of our harvest before we start growing, and then once it’s ready, you get to pick up your portion each week!)</p>`}
        />
        <FaqItem
          title="When will the subscription begin? Will pick up be every single week?"
          details={`Because farming depends on Mother Nature, the start time for each CSA will vary year to year. The Spring Share will begin some time in May, depending on how soon winter leaves and spring arrives. Summer and Early Fall Shares will follow the Spring Share. Pick up will be every week unless we notify you ahead of time. Especially in the summer, we may need to take a break for a week (vacation??), but don’t worry, this just means your share will extend an extra week, not reduced.`}
        />
        <FaqItem
          title="Where do I pick up? What is the time window for pick up?"
          details={`Pick up will always be available at the farm in North Berwick, but additional pick up spots will be added if there are enough shareholders in those areas. Pick up is on Tuesdays, with the time window still to be determined.`}
        />
        <FaqItem
          title="Is delivery available?"
          details={`At this time, delivery is not available.`}
        />
        <FaqItem
          title="What if I can’t pick up my bouquet?"
          details={`Please contact us as soon as possible to let us know not to make your bouquet. We’re happy to give you double bouquets on a future week. You are also always welcome to have someone else pick up your bouquet for you.`}
        />
        <FaqItem
          title="What if I forgot to pick up my bouquet this week?"
          details={`We send out email reminders each week before pick up day to help you remember, but we get it, sometimes life just gets ahead of us too. If your pickup location is the farm we will try to hold your bouquet and coordinate a different pickup time if possible. Off-farm locations cannot hold bouquets for more than the designated pick up day.`}
        />
        <FaqItem
          title="What if I want to buy a share as a gift?"
          details={`Fresh local flowers are a fantastic gift! When you order, provide us with your recipient’s name and contact information, and we will send you an email with a printable (or email-able) card for you to pass along. Don’t worry about us ruining any surprises...we won’t contact your recipient with reminders and details UNTIL it gets close to bouquet pick up time. If you are purchasing multiple shares as gifts for multiple people, please do each in a separate transaction so we can collect each recipient's information.`}
        />
        <FaqItem
          title="What flowers will you use?"
          details={`Each week’s bouquets will be made with what is blooming out in our field, ensuring they are the freshest flowers you can possibly get! We grow a wide variety of flowers and colors to help ensure diversity in your bouquets each week.`}
        />
        <FaqItem
          title="How big are the arrangements?"
          details={`Actual size of the bouquets is determined by how much is blooming each week (some weeks might be smaller, but they’ll even out with weeks we have an overabundance). We try to aim for 15-20 stems per bouquet. CSA bouquets are discounted 20% from our flowers sold retail elsewhere.`}
        />
        <FaqItem
          title="Are vases included?"
          details={`Vases are not included, so please bring your own or a bucket when you pick up your bouquet. If you forget we can provide a bag filled with water to rubber band around your stems.`}
        />
        <FaqItem
          title="How do I care for my flowers?"
          details={`Because our flowers are harvested within a day or two of you receiving them, they will last much longer than any flowers sold at most stores (and shipped in from other countries). The best way to keep your blooms happy is to start with clean water and a clean vase (if you wouldn’t drink it, don’t make your flowers drink it!). Make sure only stems are touching the water (remove any leaves that are too low). Changing the water each day is also very helpful, but don’t worry if you just can’t remember, your flowers will still be fine.`}
        />
        <FaqItem
          title="What happens if a natural disaster destroys all of the flowers in the field?"
          details={`While it isn’t likely that all our flowers could be destroyed from a natural disaster, it is definitely a risk that every farmer takes and we ask you to take as well. However, if we don’t have enough flowers due to our own errors, your purchase will be refunded. We do our best to work with nature and grow a wide diversity of flowers to help mitigate risks.`}
        />
        <FaqItem
          title="What if I purchased a smaller CSA share but I’m hooked and want to get a Full Season Share?"
          details={`If you have purchased an earlier share and would like to convert it to a Full Season Share, please contact us and we will apply your previous payment towards the Full Season Share.`}
        />
        <div className="mt-8">
          Still have more questions?{" "}
          <Link className="fox-green hover:underline font-bold" to="/contact">
            Contact us
          </Link>{" "}
          with any other questions you may have.
        </div>
      </div>
    </div>
  );
}

function FaqItem({ title, details }: { title: string; details: string }) {
  const [hidden, setHidden] = useState(true);
  return (
    <div className="text-left">
      <button onClick={() => setHidden(!hidden)}>
        <h3 className="font-bold text-left">
          <span className="text-2xl fox-green">+</span> {title}
        </h3>
      </button>
      <div
        className={`${hidden ? "hidden" : "block"} mb-4 text-left`}
        dangerouslySetInnerHTML={{ __html: details }}
      />
    </div>
  );
}
