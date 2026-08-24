import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FEATURES } from "@/lib/featureFlags";
import Index from "./pages/Index";
import Dev from "./pages/Dev";
import Creator from "./pages/Creator";
import Design from "./pages/Design";
import Artifacts from "./pages/Artifacts";
import Admin from "./pages/Admin";
import Affiliates from "./pages/Affiliates";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      {/* reducedMotion="user" makes every framer-motion animation respect the
          visitor's prefers-reduced-motion setting without per-component work. */}
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dev" element={<Dev />} />
              <Route path="/creator" element={<Creator />} />
              {/* Unlinked and off by default until there is real work to show. */}
              {FEATURES.design && <Route path="/design" element={<Design />} />}
              <Route path="/artifacts" element={<Artifacts />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
