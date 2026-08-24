import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ZaioCredential } from "./ZaioCredential";
import { TwoAccounts } from "./TwoAccounts";
import { CraftBreakdown } from "./CraftBreakdown";
import { VideoGrid } from "./VideoGrid";

/**
 * The content-creation section.
 *
 * Replaces the old "Content & Media" block, which framed this as a
 * self-improvement hobby. It is a paid contract, so the credential and the
 * reach figures lead and the videos are the evidence.
 */
export const ContentCreation = () => {
  return (
    <section id="media" className="py-24 border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
              Content creation
            </h2>
            <p className="text-center text-neutral-600 mb-12 text-lg font-medium max-w-2xl mx-auto">
              Short-form tech education for South African students &mdash; written, shot and
              edited by me, on contract and on my own channel.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-16">
            <ZaioCredential />
            <TwoAccounts />
          </div>

          <div className="mb-16">
            <CraftBreakdown />
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mb-6">
              Six videos worth watching
            </h3>
            <VideoGrid />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  The Alphas Club
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  Weekly newsletter for growth, tech tips, and community building
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" size="sm" asChild>
                  <a
                    href="https://jaymthethwa.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail aria-hidden="true" className="mr-2 h-4 w-4" />
                    Subscribe to the newsletter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://www.instagram.com/thereeljaymiller"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram aria-hidden="true" className="mr-2 h-4 w-4" />
                    Instagram
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
