import { motion } from "framer-motion";
import { Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const Media = () => {
  return (
    <section id="media" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
              Content & Media
            </h2>
            <p className="text-center text-neutral-500 mb-12 text-lg font-medium">
              Documenting my coding journey and empowering young South African learners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-neutral-900">Social Media Presence</CardTitle>
                  <CardDescription className="text-neutral-500">
                    Creating relatable, educational content for the next generation of developers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed text-sm font-medium">
                    Through TikTok and Instagram, I share my self-improvement journey, 
                    coding challenges, tips, and motivational content designed to inspire 
                    young South Africans to pursue tech careers.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.tiktok.com/@realjaycoding" target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" />
                        TikTok
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.instagram.com/thereeljaymiller" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-4 w-4" />
                        Instagram
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-neutral-900">The Alphas Club</CardTitle>
                  <CardDescription className="text-neutral-500">
                    Weekly newsletter for growth, tech tips, and community building
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed text-sm font-medium">
                    Join The Alphas Club newsletter for weekly insights on personal development, 
                    and self-improvement, applying self-help books everyday.
                  </p>
                  <Button variant="default" size="sm" className="w-full" asChild>
                    <a href="https://jaymthethwa.substack.com" target="_blank" rel="noopener noreferrer">
                      <Mail className="mr-2 h-4 w-4" />
                      Subscribe to Newsletter
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>


        </div>
      </div>
    </section>
  );
};
