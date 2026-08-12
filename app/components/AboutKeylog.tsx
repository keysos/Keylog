import placeholder_2 from "@/assets/placeholder_2.png";
import Image from "next/image";

const AboutKeylog = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold">What is Keylog?</h2>
      <p className="text-muted-foreground">
        Keylog is a place to keep track of the games you play. Add games to your
        library, keep a record of what you&apos;ve played, and discover new
        titles along the way. Whether you&apos;re revisiting an old favorite or
        starting something new, Keylog makes it easy to organize your gaming
        journey and keep everything in one place.
      </p>
      <div className="space-y-8 md:space-y-12">
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
          <Image
            src={placeholder_2}
            alt="Keylog profile library"
            className="w-full rounded-xs"
            width={440}
          />
          <div className="flex flex-col justify-center gap-2">
            <h3 className="text-2xl font-bold">
              Track your personal game collection
            </h3>
            <p className="text-muted-foreground">
              Keep your entire game collection organized in one place. Add the
              games you own, keep track of what you&apos;ve played, and build a
              personal library that reflects your gaming journey.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <div className="order-2 flex flex-col justify-center gap-2 sm:order-1">
            <h3 className="text-2xl font-bold">
              Express your thoughts with reviews
            </h3>
            <p className="text-muted-foreground">
              Share your thoughts on the games you play. Write reviews, rate
              your experiences, and let others know what you loved, disliked, or
              remembered most.
            </p>
          </div>
          <Image
            src={placeholder_2}
            alt="Keylog profile library"
            className="order-1 w-full rounded-xs sm:order-2"
            width={440}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <Image
            src={placeholder_2}
            alt="Keylog profile library"
            className="w-full rounded-xs"
            width={440}
          />
          <div className="flex flex-col justify-center gap-2">
            <h3 className="text-2xl font-bold">
              Create and organize games with lists
            </h3>
            <p className="text-muted-foreground">
              Create custom lists to organize your games however you want. Group
              your favorites, keep track of what you want to play, or make lists
              around specific genres, moods, and experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutKeylog;
