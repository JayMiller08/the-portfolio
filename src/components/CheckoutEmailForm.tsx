import { useId, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { formatPrice, startCheckout } from "@/lib/store";

interface CheckoutEmailFormProps {
  slug: string;
  priceCents: number;
  currency: string;
  delivery: "download" | "access";
  autoFocus?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email first, then Paystack's hosted checkout.
 *
 * The email is required before checkout starts: it is recorded on the pending
 * order, so it is captured even if the visitor abandons the payment page.
 */
export const CheckoutEmailForm = ({
  slug,
  priceCents,
  currency,
  delivery,
  autoFocus = false,
}: CheckoutEmailFormProps) => {
  const inputId = useId();
  const errorId = useId();
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
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>Email address</Label>
        <Input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
          disabled={isLoading}
          autoFocus={autoFocus}
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive font-medium">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin mr-2" />
            Redirecting to checkout…
          </>
        ) : (
          `Continue to pay ${formatPrice(priceCents, currency)}`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground leading-relaxed">
        Your {delivery === "access" ? "access link" : "download"} appears on screen right
        after payment. Your email is used for the receipt, and to help if you lose it.
      </p>

      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
        <Lock aria-hidden="true" className="h-3 w-3" />
        Secure payment via Paystack
      </p>
    </form>
  );
};
