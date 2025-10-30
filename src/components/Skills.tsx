import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "Java", level: "Confident" },
        { name: "JavaScript", level: "Intermediate" },
        { name: "HTML/CSS", level: "Moderate" },
        { name: "SQL", level: "Learning" },
      ],
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "React", level: "Learning" },
        { name: "Tailwind CSS", level: "Intermediate" },
        { name: "Node.js", level: "Learning" },
      ],
    },
    {
      title: "Tools & Technologies",
      skills: [
        { name: "Git/GitHub", level: "Confident" },
        { name: "VS Code", level: "Confident" },
        { name: "IntelliJ IDEA", level: "Confident" },
        { name: "Docker", level: "Novice" },
      ],
    },
    {
      title: "Core Competencies",
      skills: [
        { name: "Object-Oriented Programming", level: "Confident" },
        { name: "Data Structures & Algorithms", level: "Intermediate" },
        { name: "Problem Solving", level: "Confident" },
        { name: "Technical Teaching", level: "Confident" },
      ],
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Confident":
        return "bg-accent text-accent-foreground";
      case "Intermediate":
        return "bg-primary text-primary-foreground";
      case "Moderate":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="skills" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Skills & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Expertise</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Constantly learning and growing my technical skillset
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill) => (
                        <div key={skill.name} className="flex flex-col gap-1">
                          <Badge variant="outline" className="font-medium">
                            {skill.name}
                          </Badge>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-accent/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Currently Learning</h3>
                <p className="text-muted-foreground mb-4">
                  Following a 4-week JavaScript intensive program, deepening React knowledge, 
                  and building practical projects for my freelance web development journey.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-sm">Advanced React Patterns</Badge>
                  <Badge variant="secondary" className="text-sm">REST APIs</Badge>
                  <Badge variant="secondary" className="text-sm">Responsive Design</Badge>
                  <Badge variant="secondary" className="text-sm">Testing</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
