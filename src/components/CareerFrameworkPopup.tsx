import { useState, useEffect } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export const CareerFrameworkPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user already downloaded or dismissed it in this session/localstorage
    // const hasDownloaded = localStorage.getItem("career_framework_downloaded");
    // const hasDismissed = localStorage.getItem("career_framework_dismissed");
    
    // Temporarily disabled for testing so it always shows up
    if (true) {
      // Add a slight delay before showing the popup so it feels natural
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDismiss = () => {
    localStorage.setItem("career_framework_dismissed", "true");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const { error: supabaseError } = await supabase
        .from("subscribers")
        .insert([
          {
            email: email.trim().toLowerCase(),
            source: "Career Framework Popup",
          },
        ]);

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          // Email already exists, that's fine
        } else {
          throw supabaseError;
        }
      }

      setIsUnlocked(true);
      toast({
        title: "Success!",
        description: "Your free guide is ready to download.",
      });
    } catch (err: any) {
      console.error("Error saving email:", err);
      // Display the actual error message from Supabase for easier debugging
      setError(err.message || err.details || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    localStorage.setItem("career_framework_downloaded", "true");
    const link = document.createElement("a");
    link.href = "/AI%20Productivity%20Framework.pdf";
    link.download = "AI Productivity Framework.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                className="absolute right-6 top-6 text-foreground/50 hover:text-foreground transition-colors z-10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 p-2 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-white/80 to-white/30 dark:from-white/20 dark:to-white/5 backdrop-blur-xl flex items-center justify-center border border-white/50 dark:border-white/10 shadow-lg"
                >
                  <span className="text-3xl">🚀</span>
                </motion.div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  AI Productivity Framework is now LIVE
                </h2>
                <p className="text-foreground/70 font-medium text-lg">
                  Get it Now for FREE!
                </p>
              </div>
            </div>

            <div className="px-8 pb-8 pt-4">
              {!isUnlocked ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className={`h-12 bg-white/50 dark:bg-black/20 backdrop-blur-md border-white/30 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 transition-colors ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 px-8 font-bold shadow-lg w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all hover:scale-105"  disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "GET"
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">{error}</p>
                  )}
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Join other developers upgrading their careers. No spam, unsubscribe anytime.
                  </p>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <h3 className="text-lg font-semibold">You're all set!</h3>
                    <p className="text-muted-foreground text-sm">Click the button below to download your framework.</p>
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    DOWNLOAD FRAMEWORK
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
