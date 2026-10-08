import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckoutEmailForm } from "./CheckoutEmailForm";
import { WaitlistForm } from "./WaitlistForm";
import { useStorePrices } from "@/hooks/useStorePrices";
import { formatPrice, isLaunchOffer } from "@/lib/store";
import { REDLINE_WORKBOOK } from "@/data/redlineWorkbook";

const DISMISS_KEY = "redline-launch-popup-dismissed";
const OPEN_DELAY_MS = 1500;

// Storage can throw in private windows or with site data blocked; a failure
// just means the popup may show again, which is harmless.
const wasDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

const rememberDismissal = () => {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // ignore
  }
};

/**
 * Homepage popup for the Redline Portfolio Grader, in one of two modes:
 *
 *   - waitlist: the product is not on sale yet, so it collects emails and
 *     takes no payment;
 *   - launch: the launch offer is live, so it goes straight to checkout.
 *
 * Once launch spots are sold out it never renders, so it cannot advertise an
 * offer checkout would refuse.
 *
 * Dismissal is remembered for the browser session, so returning to the
 * homepage within one visit does not reopen it.
 */
export const WorkbookLaunchPopup = () => {
  const { data: prices, isSuccess } = useStorePrices();
  const offer = prices?.[REDLINE_WORKBOOK.slug!];
  const terms = REDLINE_WORKBOOK.waitlist;

  // No offer means "not on sale yet" only when the lookup actually succeeded;
  // a failed lookup shows nothing rather than guessing.
  const mode: "launch" | "waitlist" | null = isLaunchOffer(offer)
    ? "launch"
    : isSuccess && !offer && terms
      ? "waitlist"
      : null;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!mode || wasDismissed()) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [mode]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) rememberDismissal();
  };

  if (!mode) return null;

  const quantity = mode === "launch" ? offer!.launch_quantity : terms!.launchQuantity;
  const priceLabel =
    mode === "launch"
      ? formatPrice(offer!.price_cents, offer!.currency)
      : formatPrice(terms!.launchPriceCents, terms!.currency);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">
            {mode === "launch" ? (
              <>Launch offer &middot; first {quantity} only</>
            ) : (
              <>Coming soon &middot; launch price for the first {quantity}</>
            )}
          </p>
          <DialogTitle className="text-2xl font-black tracking-tight text-neutral-950">
            {REDLINE_WORKBOOK.title}
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            Paste your portfolio URL. Read what the recruiter actually saw.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-baseline justify-center gap-3">
          <span className="text-4xl font-black text-neutral-950">{priceLabel}</span>
          <span className="text-sm font-semibold text-neutral-700">
            {mode === "launch"
              ? `${offer!.launch_remaining} of ${quantity} spots left`
              : `for the first ${quantity} buyers`}
          </span>
        </div>

        {mode === "launch" ? (
          <CheckoutEmailForm
            slug={REDLINE_WORKBOOK.slug!}
            priceCents={offer!.price_cents}
            currency={offer!.currency}
            delivery={offer!.delivery}
          />
        ) : (
          <WaitlistForm productSlug={REDLINE_WORKBOOK.slug!} />
        )}

        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
            Maybe later
          </Button>
          <Link
            to="/artifacts"
            onClick={() => handleOpenChange(false)}
            className="text-xs text-neutral-600 underline underline-offset-4 hover:text-neutral-900 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            See it in Digital Tools
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
