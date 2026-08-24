import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code2, Clapperboard, ArrowRight } from "lucide-react";

interface TrackCard {
  to: string;
  icon: typeof Code2;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}

const TRACKS: TrackCard[] = [
  {
    to: "/dev",
    icon: Code2,
    eyebrow: "For engineering teams",
    title: "Developer work",
    description:
      "Full-stack web applications, the stack I use, and the code behind them.",
    points: ["StudentOS", "AmanziGuard", "Skills & GitHub"],
  },
  {
    to: "/creator",
    icon: Clapperboard,
    eyebrow: "For brands and marketing teams",
    title: "Creator work",
    description:
      "Short-form tech education, written, shot and edited end to end.",
    points: ["Reach & results", "Zaio contract", "Six flagship videos"],
  },
];

/**
 * The two entry points on the landing page.
 *
 * Applications go to two different kinds of role, so the visitor picks the
 * track that matches why they came rather than reading a merged pitch.
 */
export const RouteChooser = () => {
  return (
    <section className="py-16 border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-center text-neutral-950 tracking-tight">
            What did you come here for?
          </h2>
          <p className="text-center text-neutral-600 mb-10 text-lg font-medium">
            Both are mine. Pick whichever matters to you.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {TRACKS.map((track, index) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.to}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={track.to}
                    className="group flex h-full flex-col rounded-2xl border border-neutral-200/60 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] motion-safe:hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <Icon aria-hidden="true" className="h-9 w-9 text-neutral-800 mb-4" />

                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      {track.eyebrow}
                    </p>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">{track.title}</h3>
                    <p className="text-neutral-600 leading-relaxed mb-5">{track.description}</p>

                    <ul className="space-y-1.5 mb-6 flex-1">
                      {track.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span aria-hidden="true" className="text-neutral-900 font-bold mt-0.5">
                            &bull;
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <span className="inline-flex items-center gap-2 font-semibold text-neutral-900 mt-auto">
                      View
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 motion-safe:group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
