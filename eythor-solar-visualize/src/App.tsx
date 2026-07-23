
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import BuyNowPage from "./pages/BuyNow";
import SolarQuote from "./pages/SolarQuote";
import SolarPanelSetup from "./pages/SolarPanelSetup";
import SolarPanelGuide from "./pages/SolarPanelGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<SolarQuote />} />
          <Route path="/buynow" element={<BuyNowPage />} />
          <Route path="/solar-panel-setup" element={<SolarPanelSetup />} />
          <Route path="/solar-panel-guide" element={<SolarPanelGuide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
