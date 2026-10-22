import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

const DISMISS_KEY = "blank-file-popup-dismissed";
const OPEN_DELAY_MS = 1500;

// Founding spots close Fri 6 Nov 2026, 23:59 SAST. After that the popup never
// renders, so it cannot advertise a cohort that is no longer taking people.
// Keep in step with CONFIG.closesAt in public/blank-file.html.
const CLOSES_AT = new Date("2026-11-06T23:59:00+02:00").getTime();

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

const daysLeftLabel = () => {
  const days = Math.floor((CLOSES_AT - Date.now()) / 86_400_000);
  if (days >= 2) return `${days} days left`;
  if (days === 1) return "1 day left";
  return "Closes tonight";
};

/**
 * Homepage popup announcing the Blank File founding Java cohort.
 *
 * It sends people to /blank-file, a static page served from public/ (not a
 * React route), so the link is a plain anchor rather than a router Link.
 *
 * Dismissal is remembered for the browser session, so returning to the
 * homepage within one visit does not reopen it.
 */
export const BlankFilePopup = () => {
  const isOpenForSignups = Date.now() < CLOSES_AT;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isOpenForSignups || wasDismissed()) return;
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isOpenForSignups]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) rememberDismissal();
  };

  if (!isOpenForSignups) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Founding cohort &middot; starts Mon 9 Nov
          </p>
          <DialogTitle className="text-2xl font-black tracking-tight text-neutral-950">
            In the exam, it's you and a blank file.
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            Blank File is a 4-week Java cohort for first-years writing a Java exam or a sup this
            season. Live lessons, daily check-ins on Discord, timed Friday tests and a full mock
            exam.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-baseline justify-center gap-3">
          <span className="text-4xl font-black text-neutral-950">R149</span>
          <span className="text-sm font-semibold text-neutral-700">
            25 spots &middot; {daysLeftLabel()}
          </span>
        </div>

        <Button asChild size="lg" className="w-full rounded-xl">
          <a href="/blank-file" onClick={() => rememberDismissal()}>
            See what's inside
          </a>
        </Button>

        <p className="text-center text-xs text-neutral-600">
          Full refund if it doesn't run, or after week 1 if it's not for you.
        </p>

        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
