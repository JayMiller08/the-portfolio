import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckoutEmailForm } from "./CheckoutEmailForm";
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
 * Homepage launch popup for the Redline Portfolio Grader.
 *
 * Appears only while the launch offer is live in the store — product active,
 * launch price in effect, spots remaining. Inactive or sold out, it never
 * renders, so it cannot advertise an offer checkout would refuse.
 *
 * Dismissal is remembered for the browser session, so returning to the
 * homepage within one visit does not reopen it.
 */
export const WorkbookLaunchPopup = () => {
  const { data: prices } = useStorePrices();
  const offer = prices?.[REDLINE_WORKBOOK.slug!];
  const live = isLaunchOffer(offer);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!live || wasDismissed()) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [live]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) rememberDismissal();
  };

  if (!live || !offer) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">
            Launch offer &middot; first {offer.launch_quantity} only
          </p>
          <DialogTitle className="text-2xl font-black tracking-tight text-neutral-950">
            {REDLINE_WORKBOOK.title}
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            Paste your portfolio URL. Read what the recruiter actually saw.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-baseline justify-center gap-3">
          <span className="text-4xl font-black text-neutral-950">
            {formatPrice(offer.price_cents, offer.currency)}
          </span>
          <span className="text-sm font-semibold text-neutral-700">
            {offer.launch_remaining} of {offer.launch_quantity} spots left
          </span>
        </div>

        <CheckoutEmailForm
          slug={REDLINE_WORKBOOK.slug!}
          priceCents={offer.price_cents}
          currency={offer.currency}
          delivery={offer.delivery}
        />

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
