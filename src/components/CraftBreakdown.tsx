import { motion } from "framer-motion";

interface CraftStep {
  title: string;
  detail: string;
}

/**
 * The five steps are a genuine sequence, so they are rendered as an ordered
 * list and the numbering is real content rather than decoration.
 */
const STEPS: CraftStep[] = [
  {
    title: "Script",
    detail:
      "I write every video. The hook has to land in under two seconds or nothing after it matters.",
  },
  { title: "Shoot", detail: "Self-shot, self-directed, self-lit. No crew." },
  {
    title: "Edit",
    detail: "CapCut Desktop. Cuts, captions, motion graphics, sound design, pacing.",
  },
  {
    title: "Publish",
    detail: "TikTok, Instagram Reels and YouTube Shorts, reformatted per platform.",
  },
  {
    title: "Analyse",
    detail: "Retention curves and drop-off points feed straight into the next script.",
  },
];

export const CraftBreakdown = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-6">
        How a video actually gets made
      </h3>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 list-none p-0 m-0">
        {STEPS.map((step, index) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="h-full bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-black mb-3 shrink-0"
            >
              {index + 1}
            </span>
            <h4 className="font-bold text-neutral-900 mb-1">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed">{step.detail}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
};
