import { useId, useState } from "react";
import { Download, ExternalLink, Loader2, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  isResourceUnlocked,
  normalizePhone,
  rememberResourceUnlocked,
  saveWhatsAppLead,
  type LeadSource,
} from "@/lib/whatsapp";

export interface GatedResource {
  slug: string;
  title: string;
  fileUrl: string;
  fileName: string;
}

interface WhatsAppResourceGateProps {
  resource: GatedResource;
  source: LeadSource;
  autoFocus?: boolean;
}

/**
 * Asks for a WhatsApp number, then hands over the resource.
 *
 * The consent tick is required, and stored with the number as consented_at,
 * because POPIA requires opt-in consent before anyone is marketed to on
 * WhatsApp. A visitor who has already unlocked the resource on this device
 * goes straight to the download.
 */
export const WhatsAppResourceGate = ({ resource, source, autoFocus = false }: WhatsAppResourceGateProps) => {
  const phoneId = useId();
  const consentId = useId();
  const errorId = useId();
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Read on first render, so a returning visitor never sees the form flash
  // before the download appears.
  const [unlocked, setUnlocked] = useState(() => isResourceUnlocked(resource.slug));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = normalizePhone(phone);
    // `in` narrows the union even without strictNullChecks, unlike `!parsed.ok`.
    if ("error" in parsed) {
      setError(parsed.error);
      return;
    }
    if (!consent) {
      setError("Please tick the box to agree to WhatsApp messages.");
      return;
    }

    setIsLoading(true);
    try {
      await saveWhatsAppLead({ phone: parsed.e164, resourceSlug: resource.slug, source });
      rememberResourceUnlocked(resource.slug);
      setUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (unlocked) {
    return (
      <div className="space-y-3" role="status">
        <p className="text-center text-sm font-semibold text-neutral-900">
          It&rsquo;s yours. Download it and open it in any browser.
        </p>
        <Button asChild size="lg" className="w-full">
          <a href={resource.fileUrl} download={resource.fileName}>
            <Download aria-hidden="true" className="mr-2 h-5 w-5" />
            Download the workbook
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" />
            Open it in your browser instead
          </a>
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Your answers save in the browser you fill it in, so stick to one device.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={phoneId}>WhatsApp number</Label>
        <Input
          id={phoneId}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="071 234 5678"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error) && !normalizePhone(phone).ok}
          aria-describedby={error ? errorId : undefined}
          disabled={isLoading}
          autoFocus={autoFocus}
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id={consentId}
          checked={consent}
          onCheckedChange={(value) => {
            setConsent(value === true);
            setError("");
          }}
          disabled={isLoading}
          className="mt-0.5"
          aria-describedby={error ? errorId : undefined}
        />
        <Label htmlFor={consentId} className="text-sm font-normal leading-snug text-neutral-700">
          I agree to receive WhatsApp messages from Jay (Real Jay Coding) about free resources and
          programmes like this one. I can opt out at any time.
        </Label>
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
            Unlocking…
          </>
        ) : (
          <>
            <MessageCircle aria-hidden="true" className="mr-2 h-4 w-4" />
            Get the free workbook
          </>
        )}
      </Button>
    </form>
  );
};
