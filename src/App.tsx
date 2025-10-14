// @ts-nocheck
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const DestinationSelect = lazy(() => import("./pages/DestinationSelect"));
const TripBrief = lazy(() => import("./pages/TripBrief"));
const Itinerary = lazy(() => import("./pages/Itinerary"));
const Checklist = lazy(() => import("./pages/Checklist"));
const Runsheet = lazy(() => import("./pages/Runsheet"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
