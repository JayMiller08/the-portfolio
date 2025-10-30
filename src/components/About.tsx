import { motion } from "framer-motion";
import { GraduationCap, Users, Video, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const About = () => {
  const highlights = [
    {
      icon: GraduationCap,
      title: "Student & Learner",
      description: "Diploma in Computer Science (Extended) at Tshwane University of Technology",
    },
    {
      icon: Users,
      title: "Teacher & Tutor",
      description: "Hosting 1h30 online classes on Java fundamentals, ArrayLists, and Functions",
    },
    {
      icon: Video,
      title: "Content Creator",
      description: "Creating educational tech content for young South African learners",
    },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Story</span>
          </h2>
          
          <div className="prose prose-lg dark:prose-invert mx-auto mb-12">
            <p className="text-center text-lg text-muted-foreground">
              I'm a 19-year-old South African developer with a strong Java background, 
              currently transitioning into JavaScript and React. I'm passionate about building 
              meaningful projects, teaching others, and documenting my journey into freelance 
              web development. My mission is to empower South African teens through accessible 
              tech education and inspire them to pursue their coding dreams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <item.icon className="h-10 w-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/JayMiller08" target="_blank" rel="noopener noreferrer">
                View GitHub Profile
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
