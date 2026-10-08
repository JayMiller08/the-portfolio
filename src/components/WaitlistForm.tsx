import { useId, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { joinWaitlist } from "@/lib/waitlist";

interface WaitlistFormProps {
  productSlug: string;
  autoFocus?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pre-launch email capture. Takes no payment and promises only what a waitlist
 * is: an email when the product opens.
 */
export const WaitlistForm = ({ productSlug, autoFocus = false }: WaitlistFormProps) => {
  const inputId = useId();
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [joined, setJoined] = useState(false);

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
      await joinWaitlist(productSlug, trimmed);
      setJoined(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (joined) {
    return (
      <div role="status" className="flex flex-col items-center text-center gap-2 py-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Check aria-hidden="true" className="h-5 w-5 text-green-700" />
        </span>
        <p className="font-semibold text-neutral-900">You're on the list.</p>
        <p className="text-sm text-neutral-600">We'll email you the moment it launches.</p>
      </div>
    );
  }

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
            Joining…
          </>
        ) : (
          "Notify me at launch"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        No payment now. One email when it launches.
      </p>
    </form>
  );
};
