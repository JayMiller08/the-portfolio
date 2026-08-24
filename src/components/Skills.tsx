import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * How far along I actually am with something. Ordered most to least depth.
 * These are the only permitted values, so a level cannot drift into prose.
 */
export type SkillLevel = "Strong" | "Working" | "Building with" | "Exploring";

interface Skill {
  name: string;
  level: SkillLevel;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const Skills = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      skills: [
        { name: "Java", level: "Strong" },
        { name: "TypeScript", level: "Working" },
        { name: "JavaScript", level: "Working" },
        { name: "HTML/CSS", level: "Working" },
        { name: "SQL", level: "Building with" },
      ],
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "React", level: "Working" },
        { name: "Tailwind CSS", level: "Working" },
        { name: "Node.js", level: "Building with" },
      ],
    },
    {
      title: "Tools & Technologies",
      skills: [
        { name: "Git/GitHub", level: "Strong" },
        { name: "VS Code", level: "Strong" },
        { name: "IntelliJ IDEA", level: "Strong" },
        { name: "Docker", level: "Exploring" },
      ],
    },
    {
      title: "Core Competencies",
      skills: [
        { name: "Object-Oriented Programming", level: "Strong" },
        { name: "Data Structures & Algorithms", level: "Working" },
        { name: "Problem Solving", level: "Strong" },
        { name: "Technical Teaching", level: "Strong" },
      ],
    },
  ];

  // Background darkens with depth of experience. Text tones are chosen so every
  // pill clears WCAG AA against its own background, including the lightest tier.
  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case "Strong":
        return "bg-neutral-900 text-white font-semibold";
      case "Working":
        return "bg-neutral-200 text-neutral-900 font-semibold";
      case "Building with":
        return "bg-neutral-100 text-neutral-800 font-medium";
      case "Exploring":
        return "bg-neutral-50 text-neutral-700 font-medium border border-neutral-200";
    }
  };

  return (
    <section id="skills" className="py-24 bg-neutral-50/50 border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
              Skills & Expertise
            </h2>
            <p className="text-center text-neutral-500 mb-12 text-lg font-medium">
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
                <Card className="h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-neutral-900">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill) => (
                        <div key={skill.name} className="flex flex-col gap-1.5">
                          <Badge variant="outline" className="font-semibold border-neutral-300 text-neutral-800 bg-white shadow-sm">
                            {skill.name}
                          </Badge>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${getLevelColor(skill.level)}`}>
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
            <Card className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <CardContent className="p-8">
                <h3 className="text-2xl font-black mb-2 text-neutral-900 tracking-tight">Currently deepening</h3>
                <p className="text-neutral-500 mb-6 font-medium max-w-2xl mx-auto">
                  Following a 4-week JavaScript intensive program, deepening React knowledge, 
                  and building practical projects for my freelance web development journey.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-800 border-neutral-250/60 font-semibold">Advanced React Patterns</Badge>
                  <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-800 border-neutral-250/60 font-semibold">REST APIs</Badge>
                  <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-800 border-neutral-250/60 font-semibold">Responsive Design</Badge>
                  <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-800 border-neutral-250/60 font-semibold">Testing</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
