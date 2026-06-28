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
    <section id="about" className="py-24 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center text-neutral-950 tracking-tight">
            My Story
          </h2>
          
          <div className="prose prose-lg mx-auto mb-12">
            <p className="text-center text-lg text-neutral-600 font-medium max-w-2xl mx-auto leading-relaxed">
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
                <Card className="h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                     <item.icon className="h-10 w-10 text-neutral-800 mb-4" />
                     <h3 className="text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                     <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" asChild>
              <a href="/Kwandumusa%27s%20Resume.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </a>
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
