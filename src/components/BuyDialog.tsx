import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Lock } from "lucide-react";
import { formatPrice, startCheckout } from "@/lib/store";

interface BuyDialogProps {
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  children: React.ReactNode;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const BuyDialog = ({ slug, title, priceCents, currency, children }: BuyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const checkoutUrl = await startCheckout(slug, trimmed);
      // Hand off to Paystack's hosted checkout; card details are never entered
      // on this site.
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy {title}</DialogTitle>
          <DialogDescription>
            We'll send your download to this address, and show it on screen right after payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col gap-3">
            <Input
              id="buy-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Redirecting to checkout…
                </>
              ) : (
                `Pay ${formatPrice(priceCents, currency)}`
              )}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" />
            Secure payment via Paystack
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
