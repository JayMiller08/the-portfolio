import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceUrl: string;
  resourceType: "pdf" | "video" | "link" | "figma";
}

export const EmailCaptureModal = ({
  isOpen,
  onClose,
  resourceTitle,
  resourceUrl,
  resourceType,
}: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Check if user already provided email in this session
  const hasSessionEmail = () => {
    return localStorage.getItem("artifacts_email_captured") === "true";
  };

  useEffect(() => {
    if (isOpen && hasSessionEmail()) {
      // User already provided email, directly trigger access
      triggerAccess();
      onClose();
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const triggerAccess = () => {
    if (resourceType === "pdf") {
      // Trigger download
      const link = document.createElement("a");
      link.href = resourceUrl;
      link.download = resourceTitle;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Open link in new tab
      window.open(resourceUrl, "_blank");
    }
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
            source: "Artifacts Page",
          },
        ]);

      if (supabaseError) {
        // Check if it's a duplicate email error
        if (supabaseError.code === "23505") {
          // Email already exists, still grant access
          localStorage.setItem("artifacts_email_captured", "true");
          toast({
            title: "Welcome back!",
            description: "Enjoy your resource access.",
          });
          triggerAccess();
          onClose();
          return;
        }
        throw supabaseError;
      }

      // Success - save to localStorage and trigger access
      localStorage.setItem("artifacts_email_captured", "true");
      toast({
        title: "Success!",
        description: "You now have access to all resources.",
      });
      triggerAccess();
      onClose();
    } catch (err) {
      console.error("Error saving email:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // If user already has session, don't show modal
  if (hasSessionEmail()) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl">🔓</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Unlock "{resourceTitle}"
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email to get instant access to this resource and future updates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={error ? "border-destructive" : ""}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Get Access"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            No spam, ever. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};