import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { WhatsAppResourceGate } from "./WhatsAppResourceGate";
import { FIRST_YEAR_WORKBOOK } from "@/data/firstYearWorkbook";
import { isResourceUnlocked } from "@/lib/whatsapp";

const DISMISS_KEY = "first-year-workbook-popup-dismissed";
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
 * Homepage popup offering The First-Year CS Workbook for a WhatsApp number.
 *
 * Skipped for anyone who has already unlocked the workbook on this device, and
 * dismissal is remembered for the browser session, so it is shown at most once
 * per visit and never to someone who already has it.
 */
export const FirstYearWorkbookPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (wasDismissed() || isResourceUnlocked(FIRST_YEAR_WORKBOOK.slug)) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) rememberDismissal();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Free &middot; for first-years
          </p>
          <DialogTitle className="text-2xl font-black tracking-tight text-neutral-950">
            {FIRST_YEAR_WORKBOOK.title}
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            A fill-it-in guide to your first year of Computer Science or IT at a South African
            university. 11 sections and 3 calculators.
          </DialogDescription>
        </DialogHeader>

        <WhatsAppResourceGate resource={FIRST_YEAR_WORKBOOK} source="homepage_popup" />

        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
            Maybe later
          </Button>
          <Link
            to="/artifacts"
            onClick={() => handleOpenChange(false)}
            className="text-xs text-neutral-600 underline underline-offset-4 hover:text-neutral-900 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            See all resources
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
