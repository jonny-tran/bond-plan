import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DestinationSelect from "./pages/DestinationSelect";
import TripBrief from "./pages/TripBrief";
import Itinerary from "./pages/Itinerary";
import Checklist from "./pages/Checklist";
import Runsheet from "./pages/Runsheet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/destinations" element={<DestinationSelect />} />
          <Route path="/trip/new" element={<TripBrief />} />
          <Route path="/trip/:id/itinerary" element={<Itinerary />} />
          <Route path="/trip/:id/checklist" element={<Checklist />} />
          <Route path="/trip/:id/runsheet" element={<Runsheet />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
