import { motion } from "framer-motion";
import { ExternalLink, Download } from "lucide-react";
import { Button } from "./ui/button";
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
      className="h-full"
    >
      <Card className="h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
          <div>
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
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <Button variant="outline" size="sm" asChild>
              <a
                href="/Kwandumusa-Mthethwa-CV-Content-Creator.pdf"
                download="Kwandumusa-Mthethwa-CV-Content-Creator.pdf"
              >
                <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                Download Creator CV
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
