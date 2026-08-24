import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "./ui/card";

/**
 * The Zaio contract. This is paid, ongoing work and the single strongest
 * credential on the creator side, so it sits above the videos rather than
 * being implied by them.
 */
export const ZaioCredential = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Social Media Content Creator &mdash;{" "}
            <a
              href="https://www.zaio.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 transition-colors inline-flex items-center gap-1"
            >
              Zaio Institute of Technology
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
            </a>
          </h3>

          <p className="mt-2 text-sm font-semibold text-neutral-600">
            Contract &middot; Remote &middot; November 2025 &ndash; Present
          </p>

          <p className="mt-4 text-neutral-600 leading-relaxed max-w-2xl">
            I create tech education and youth empowerment content under the Zaio brand:
            writing, filming and editing short-form video for TikTok, Instagram Reels
            and YouTube Shorts. The brief is to make programming and career development
            legible to South African students who are deciding whether tech is for them.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
