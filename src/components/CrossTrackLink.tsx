import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CrossTrackLinkProps {
  /** Which track the visitor is currently on. The link points at the other one. */
  from: "dev" | "creator";
}

/**
 * A single condensed line acknowledging the other half of the work.
 *
 * Both tracks are real, so neither page is allowed to imply the other does not
 * exist. On /dev this is a one-line proof of reach; on /creator it is the
 * reason the content is credible in the first place.
 */
export const CrossTrackLink = ({ from }: CrossTrackLinkProps) => {
  const isDev = from === "dev";

  return (
    <section className="py-16 border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-neutral-200/60 bg-neutral-50 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-base md:text-lg text-neutral-700 font-medium flex-1">
              {isDev ? (
                <>
                  I also create tech content professionally &mdash;{" "}
                  <strong className="text-neutral-900 font-bold">
                    1.7M+ views across two accounts
                  </strong>
                  , on contract with Zaio Institute of Technology.
                </>
              ) : (
                <>
                  The content works because I actually build the things I talk about &mdash;{" "}
                  <strong className="text-neutral-900 font-bold">
                    most recently StudentOS
                  </strong>
                  , a React, TypeScript and Supabase PWA.
                </>
              )}
            </p>

            <Link
              to={isDev ? "/creator" : "/dev"}
              className="inline-flex items-center gap-2 shrink-0 font-semibold text-neutral-900 hover:text-neutral-600 transition-colors group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-md"
            >
              {isDev ? "See the creator work" : "See the developer work"}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 motion-safe:group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
