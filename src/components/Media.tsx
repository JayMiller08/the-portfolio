import { motion } from "framer-motion";
import { Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const Media = () => {
  const contentSchedule = [
    { day: "Monday", theme: "Motivation Monday", description: "Inspiring stories and mindset tips" },
    { day: "Tuesday", theme: "Tip Tuesday", description: "Quick coding tips and tricks" },
    { day: "Wednesday", theme: "Code Challenge", description: "Fun programming challenges" },
    { day: "Thursday", theme: "Tech Thursday", description: "Latest tech news and trends" },
    { day: "Friday", theme: "Flashback Friday", description: "Reflecting on lessons learned" },
  ];

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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Content & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Media</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
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
              <Card className="h-full bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl">Social Media Presence</CardTitle>
                  <CardDescription>
                    Creating relatable, educational content for the next generation of developers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Through TikTok and Instagram, I share my self-improvement journey, 
                    coding challenges, tips, and motivational content designed to inspire 
                    young South Africans to pursue tech careers.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="accent" size="sm" asChild>
                      <a href="https://www.tiktok.com/@realjaycoding" target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" />
                        TikTok
                      </a>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
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
              <Card className="h-full bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl">The Alphas Club</CardTitle>
                  <CardDescription>
                    Weekly newsletter for growth, tech tips, and community building
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Join The Alphas Club newsletter for weekly insights on personal development, 
                    and self-improvement, applying self-help books everyday.
                  </p>
                  <Button variant="hero" size="sm" className="w-full" asChild>
                    <a href="https://jaymthethwa.substack.com" target="_blank" rel="noopener noreferrer">
                      <Mail className="mr-2 h-4 w-4" />
                      Subscribe to Newsletter
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Weekly Content Schedule</CardTitle>
                <CardDescription className="text-center">
                  Consistency is key — here's what I share each week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {contentSchedule.map((item, index) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border"
                    >
                      <p className="font-bold text-accent mb-1">{item.day}</p>
                      <p className="text-sm font-semibold mb-2">{item.theme}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
