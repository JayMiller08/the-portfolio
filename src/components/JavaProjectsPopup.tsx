import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCT_URL = "https://realjaycoding.gumroad.com/l/java-projects";

export const JavaProjectsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always show the popup on reload
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={handleDismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-2xl p-0 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]"
          >
            {/* Glassmorphic header */}
            <div className="relative p-8 pb-4 text-center text-foreground">
              <button
                onClick={handleDismiss}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-foreground/50 hover:text-foreground transition-colors z-50 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 pointer-events-none" />
              </button>

              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-white/80 to-white/30 dark:from-white/20 dark:to-white/5 backdrop-blur-xl flex items-center justify-center border border-white/50 dark:border-white/10 shadow-lg"
                >
                  <span className="text-3xl">☕</span>
                </motion.div>

                <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">
                  New digital product
                </p>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  Build Your First 5 Java Projects
                </h2>
                <p className="text-foreground/70 font-medium text-lg">
                  Go from following tutorials to writing real Java, one project at a time.
                </p>
              </div>
            </div>

            <div className="px-8 pb-8 pt-4">
              <Button
                asChild
                className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-lg transition-all hover:scale-[1.02] group"
              >
                <a href={PRODUCT_URL} target="_blank" rel="noopener noreferrer">
                  See what's inside
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <button
                onClick={handleDismiss}
                className="mt-4 w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
