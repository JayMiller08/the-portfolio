import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ExternalLink, Loader2, Download } from "lucide-react";
import { Product } from "./ProductCard";
import { useSubscribe } from "@/hooks/useSubscribe";

interface EmailDownloadDialogProps {
  product: Product;
  children: React.ReactNode;
}

export const EmailDownloadDialog = ({ product, children }: EmailDownloadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    email, 
    setEmail, 
    isLoading, 
    error, 
    setError, 
    isUnlocked, 
    setIsUnlocked, 
    handleSubmit 
  } = useSubscribe({
    source: `Product Download: ${product.title}`,
    onSuccessMessage: "Your free resource is ready to download.",
  });

  const handleDownload = () => {
    if (!product.downloadUrl) return;
    const link = document.createElement("a");
    link.href = product.downloadUrl;
    link.download = product.downloadUrl.split('/').pop() || "download";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
    
    // Reset state after a short delay so the next time they open it, it asks again or stays unlocked
    // depending on preference. Here we reset it.
    setTimeout(() => {
      setIsUnlocked(false);
      setEmail("");
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get {product.title}</DialogTitle>
          <DialogDescription>
            Enter your email to get this free resource sent straight to your inbox and download immediately.
          </DialogDescription>
        </DialogHeader>
        
        {!isUnlocked ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="flex flex-col gap-3">
              <Input
                id="email"
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Unlock Download
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <p className="text-xs text-center text-muted-foreground mt-4">
              Join other developers upgrading their careers. No spam, unsubscribe anytime.
            </p>
          </form>
        ) : (
          <div className="space-y-6 text-center pt-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold">You're all set!</h3>
              <p className="text-muted-foreground text-sm">Click the button below to start your download.</p>
            </div>
            <Button
              onClick={handleDownload}
              className="w-full text-lg font-bold"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Now
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
