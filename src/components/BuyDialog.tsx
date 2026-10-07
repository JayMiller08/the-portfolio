import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CheckoutEmailForm } from "./CheckoutEmailForm";
import { formatPrice } from "@/lib/store";

interface BuyDialogProps {
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  delivery: "download" | "access";
  children: React.ReactNode;
}

export const BuyDialog = ({ slug, title, priceCents, currency, delivery, children }: BuyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy {title}</DialogTitle>
          <DialogDescription>
            {formatPrice(priceCents, currency)} &middot; enter your email to continue to checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <CheckoutEmailForm
            slug={slug}
            priceCents={priceCents}
            currency={currency}
            delivery={delivery}
            autoFocus
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
