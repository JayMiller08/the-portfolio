import React from 'react';
import { motion } from "framer-motion";
import { Mail, Send, Github, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
export const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // For now, create a mailto link as fallback
    const mailtoLink = `mailto:realjaycoding@gmail.com?subject=Portfolio Contact: ${formData.interest}&body=Name: ${formData.name}%0AEmail: ${formData.email}%0A%0AMessage:%0A${formData.message}`;
    window.location.href = mailtoLink;
    toast({
      title: "Opening email client",
      description: "Your message is ready to send!"
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return <section id="contact" className="py-24 bg-neutral-50/50 border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
              Let's Connect
            </h2>
            <p className="text-center text-neutral-500 mb-12 text-lg font-medium">
              Open to internships, freelance projects, and collaboration opportunities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }}>
              <Card className="text-center h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <CardContent className="pt-6">
                  <Mail className="h-10 w-10 text-neutral-700 mx-auto mb-4" />
                  <h3 className="font-bold mb-2 text-neutral-900">Email</h3>
                  <p className="text-sm text-neutral-500 font-medium">realjaycoding@gmail.com</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <Card className="text-center h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <CardContent className="pt-6">
                  <Github className="h-10 w-10 text-neutral-700 mx-auto mb-4" />
                  <h3 className="font-bold mb-2 text-neutral-900">GitHub</h3>
                  <a href="https://github.com/JayMiller08" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-900 font-semibold hover:underline">
                    @JayMiller08
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }}>
              <Card className="text-center h-full bg-white border border-neutral-200/60 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <CardContent className="pt-6">
                  <Linkedin className="h-10 w-10 text-neutral-700 mx-auto mb-4" />
                  <h3 className="font-bold mb-2 text-neutral-900">LinkedIn</h3>
                  <p className="text-sm text-neutral-500 font-medium">Kwandumusa J. Mthethwwa</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            <Card className="bg-white border border-neutral-200/60 rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-neutral-900">Send a Message</CardTitle>
                <CardDescription>
                  Interested in working together? Fill out the form below!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name *
                      </label>
                      <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="interest" className="text-sm font-medium">
                      I'm interested in
                    </label>
                    <Input id="interest" name="interest" placeholder="e.g., Internship, Freelance Project, Collaboration" value={formData.interest} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <Textarea id="message" name="message" placeholder="Tell me about your project or opportunity..." rows={6} value={formData.message} onChange={handleChange} required />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>;
};