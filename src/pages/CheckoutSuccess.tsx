import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyPayment } from "@/lib/store";

type State =
  | { kind: "loading" }
  | {
      kind: "paid";
      title: string;
      url: string;
      delivery: "download" | "access";
      emailed: boolean;
    }
  | { kind: "pending" }
  | { kind: "error"; message: string };

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  // Paystack appends both `reference` and `trxref` to the callback URL.
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!reference) {
      setState({ kind: "error", message: "This link is missing a payment reference." });
      return;
    }

    let cancelled = false;

    verifyPayment(reference)
      .then((result) => {
        if (cancelled) return;
        const url = result.access_url ?? result.download_url;
        if (result.status === "paid" && url) {
          setState({
            kind: "paid",
            title: result.title ?? "your purchase",
            url,
            delivery: result.access_url ? "access" : "download",
            emailed: Boolean(result.emailed),
          });
        } else {
          setState({ kind: "pending" });
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "We could not verify this payment.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <nav className="container mx-auto flex h-16 items-center px-4">
          <Link
            to="/artifacts"
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Resources</span>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          {state.kind === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">Confirming your payment…</h1>
              <p className="text-muted-foreground">This only takes a moment.</p>
            </>
          )}

          {state.kind === "paid" && (
            <>
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
              <p className="text-muted-foreground mb-8">
                <strong className="text-foreground">{state.title}</strong> is ready.{" "}
                {/* Only claim an email went out when one actually did. */}
                {state.emailed
                  ? "We've also emailed you a copy, so you can come back to it later."
                  : state.delivery === "access"
                    ? "Bookmark the link below so you can come back to it."
                    : "Download it now and keep the file somewhere safe."}
              </p>
              <Button size="lg" className="w-full" asChild>
                <a href={state.url} target="_blank" rel="noopener noreferrer">
                  {state.delivery === "access" ? (
                    <>
                      <ExternalLink aria-hidden="true" className="mr-2 h-5 w-5" />
                      Open {state.title}
                    </>
                  ) : (
                    <>
                      <Download aria-hidden="true" className="mr-2 h-5 w-5" />
                      Download now
                    </>
                  )}
                </a>
              </Button>
              {state.delivery === "download" && (
                <p className="text-xs text-muted-foreground mt-4">
                  This download link is valid for 24 hours.
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Lost it later? Email{" "}
                <a className="underline" href="mailto:realjaycoding@gmail.com">
                  realjaycoding@gmail.com
                </a>{" "}
                with your reference ({reference}).
              </p>
            </>
          )}

          {state.kind === "pending" && (
            <>
              <Clock className="h-10 w-10 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">Payment still processing</h1>
              <p className="text-muted-foreground mb-8">
                Your payment hasn't cleared yet. Check again in a moment — your link appears here
                as soon as it does.
              </p>
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                Check again
              </Button>
            </>
          )}

          {state.kind === "error" && (
            <>
              <AlertCircle className="h-10 w-10 mx-auto mb-6 text-destructive" />
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground mb-8">{state.message}</p>
              <p className="text-sm text-muted-foreground mb-6">
                If you were charged, email{" "}
                <a className="underline" href="mailto:realjaycoding@gmail.com">
                  realjaycoding@gmail.com
                </a>{" "}
                with your reference{reference ? ` (${reference})` : ""} and I'll sort it out.
              </p>
              <Button variant="outline" asChild>
                <Link to="/artifacts">Back to Resources</Link>
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess;
