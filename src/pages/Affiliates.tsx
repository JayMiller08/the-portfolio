import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, Loader2, DollarSign, Link as LinkIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribe } from "@/hooks/useSubscribe";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const Affiliates = () => {
  const { 
    email, 
    setEmail, 
    isLoading, 
    error, 
    setError, 
    isUnlocked, 
    setIsUnlocked, 
    handleSubmit 
  } = useSubscribe({
    source: "affiliate_page",
    onSuccessMessage: "You're in! Access your resources below.",
  });

  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const { toast } = useToast();

  const affiliateLink = "https://realjaycoding.gumroad.com/affiliates";
  const discountCode = "JAYCODING";

  const copyToClipboard = async (text: string, type: "link" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "link") {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } else {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout className="flex flex-col items-center justify-center p-4 py-20">
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="state-a"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Become an Affiliate
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                  Promote the AI Coding Tool Decision Kit and earn a commission on every sale you drive.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Earn commission</h3>
                      <p className="text-muted-foreground">Get a percentage of every referred sale automatically.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <LinkIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Unique tracking link</h3>
                      <p className="text-muted-foreground">Get a unique link instantly to track your referrals.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Exclusive discount</h3>
                      <p className="text-muted-foreground">First 50 buyers get a discount through your link.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Enter your email to get your affiliate link
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className={`h-12 text-base ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  )}
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full h-12 text-lg font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Get My Affiliate Link →"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="state-b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  You're in — here are your affiliate resources
                </h2>
                <p className="text-lg text-muted-foreground">
                  Share your link and start earning. Every sale you refer earns you a commission.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <label className="block text-sm font-semibold mb-3 text-foreground">Your Affiliate Link</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      value={affiliateLink}
                      readOnly
                      className="font-mono text-sm h-12 bg-muted/50"
                    />
                    <Button 
                      variant={linkCopied ? "default" : "hero"} 
                      className="h-12 sm:w-32 shrink-0 transition-all duration-200"
                      onClick={() => copyToClipboard(affiliateLink, "link")}
                    >
                      {linkCopied ? "Copied ✓" : "Copy Link"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Share this link on your content, in your bio, or with your audience. You'll earn a commission on every sale it generates.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <label className="block text-sm font-semibold mb-3 text-foreground">Exclusive Discount Code for Your Audience</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center h-12 px-4 rounded-md border border-border bg-primary/5 font-mono text-lg font-bold text-primary tracking-wider">
                      {discountCode}
                    </div>
                    <Button 
                      variant={codeCopied ? "default" : "hero"} 
                      className="h-12 sm:w-32 shrink-0 transition-all duration-200"
                      onClick={() => copyToClipboard(discountCode, "code")}
                    >
                      {codeCopied ? "Copied ✓" : "Copy Code"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    The first 50 buyers who use this code get a discount. Share it alongside your affiliate link to increase conversions.
                  </p>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 text-center">How It Works</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-card/50 border border-border p-5 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-3">1</div>
                      <p className="font-medium text-sm">Share your affiliate link with your audience</p>
                    </div>
                    <div className="bg-card/50 border border-border p-5 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-3">2</div>
                      <p className="font-medium text-sm">They purchase the AI Coding Tool Decision Kit</p>
                    </div>
                    <div className="bg-card/50 border border-border p-5 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto mb-3">3</div>
                      <p className="font-medium text-sm">You earn a commission — tracked automatically</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Commissions and tracking are handled by Gumroad. If you have questions, reach out at <a href="mailto:hello@example.com" className="text-primary hover:underline">hello@example.com</a>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Affiliates;
