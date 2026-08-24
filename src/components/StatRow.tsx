import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface StatItem {
  /** Optional leading icon. Decorative — the label carries the meaning. */
  icon?: LucideIcon;
  value: string;
  label: string;
  /**
   * "number" renders at the large display size; "text" steps down so a word
   * such as a language name still fits the same card without wrapping.
   */
  variant?: "number" | "text";
}

interface StatRowProps {
  items: StatItem[];
  /** Names the group for screen readers, e.g. "GitHub activity". */
  ariaLabel: string;
  /** Optional note rendered under the row, e.g. a self-reported disclosure. */
  footnote?: string;
  className?: string;
}

/**
 * The shared statistics row.
 *
 * Both the GitHub row and the content-reach row render through this component
 * so the two carry identical visual weight — that equivalence is the argument
 * for the two-track positioning, so it must not drift between them.
 */
export const StatRow = ({ items, ariaLabel, footnote, className = "" }: StatRowProps) => {
  return (
    <div className={className}>
      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-label={ariaLabel}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4 items-stretch w-full list-none p-0 m-0"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.label}
              className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon aria-hidden="true" className="h-5 w-5 text-neutral-700 shrink-0" />}
                <p
                  className={
                    item.variant === "text"
                      ? "text-lg md:text-xl font-black text-neutral-900 tracking-tight pt-1 break-words"
                      : "text-3xl font-black text-neutral-900"
                  }
                >
                  {item.value}
                </p>
              </div>
              <p className="text-sm text-neutral-600 font-medium">{item.label}</p>
            </li>
          );
        })}
      </motion.ul>

      {footnote && (
        <p className="mt-3 text-xs text-neutral-500 leading-relaxed">{footnote}</p>
      )}
    </div>
  );
};
