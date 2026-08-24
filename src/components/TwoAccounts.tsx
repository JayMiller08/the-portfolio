import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";

/**
 * Explains why there are two accounts. Without this the second one reads as
 * abandoned rather than as a brand channel run under contract.
 */
export const TwoAccounts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 md:p-8 space-y-4 text-neutral-600 leading-relaxed max-w-3xl">
          <p className="text-neutral-900 font-semibold">
            I run two accounts, both mine, both active.
          </p>

          <p>
            <a
              href="https://www.tiktok.com/@realjaycoding"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 transition-colors"
            >
              @realjaycoding
            </a>{" "}
            is my own channel &mdash; the coding journey, the honest bits, the
            things I&rsquo;d say to a friend who&rsquo;s thinking about getting into tech.
          </p>

          <p>
            <a
              href="https://www.tiktok.com/@jaywithzaio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 transition-colors"
            >
              @jaywithzaio
            </a>{" "}
            is the brand channel I create and manage for Zaio Institute of
            Technology, where I&rsquo;ve been on contract since November 2025.
          </p>

          <p className="text-neutral-900 font-medium">
            Same pipeline, two voices. Knowing when to switch between them is most of the job.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
