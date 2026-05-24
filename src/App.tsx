import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import PageLoader from "./components/idenza/PageLoader";
import WhatsAppBubble from "./components/idenza/WhatsAppBubble";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";

// ─── SPOTLIGHT ────────────────────────────────────────────────────────────────
// Lazy-loaded so the canvas setup never blocks initial JS parse/hydration.
// Only rendered on marketing routes — wasted cycles on /hub-admin, /hub/dashboard.
const SpotlightBackground = lazy(() => import("@/components/idenza/SpotlightBackground"));

const SPOTLIGHT_ROUTES = new Set(["/", "/nosotros", "/proyectos", "/planes", "/regalos"]);

const ConditionalSpotlight = () => {
  const { pathname } = useLocation();
  // Comunidad pages also benefit from the ambient canvas effect
  const isMarketing =
    SPOTLIGHT_ROUTES.has(pathname) || pathname.startsWith("/comunidad") || pathname === "/ecommerce" || pathname === "/ecommerce-floreria";
  if (!isMarketing) return null;
  return (
    // fallback={null} — canvas is decorative, never block render for it
    <Suspense fallback={null}>
      <SpotlightBackground />
    </Suspense>
  );
};

// ─── WIDGETS ──────────────────────────────────────────────────────────────────
const PublicOnlyWidgets = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/hub") || pathname === "/crece" || pathname.startsWith("/r/") || pathname.startsWith("/onboarding/")) return null;
  return (
    <WhatsAppBubble />
  );
};

// ─── PAGES (lazy) ─────────────────────────────────────────────────────────────
// Each page is an independent chunk. With manualChunks in vite.config.ts the
// shared vendor code is deduplicated into stable cache-friendly bundles.
const Index           = lazy(() => import("./pages/Index"));
const Nosotros        = lazy(() => import("./pages/Nosotros"));
const Proyectos       = lazy(() => import("./pages/Proyectos"));
const Planes          = lazy(() => import("./pages/Planes"));
const NotFound        = lazy(() => import("./pages/NotFound"));
const AdminHub        = lazy(() => import("./pages/AdminHub"));
const Login           = lazy(() => import("./pages/Login"));
const ForgotPassword  = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword  = lazy(() => import("./pages/UpdatePassword"));
const Crece           = lazy(() => import("./pages/Crece"));
const Comunidad       = lazy(() => import("./pages/Comunidad"));
const PostView        = lazy(() => import("./pages/PostView"));
const ForumTopic      = lazy(() => import("./pages/ForumTopic"));
const ClientOnboarding = lazy(() => import("./pages/ClientOnboarding"));
const TrackerView     = lazy(() => import("./pages/TrackerView"));
const ClientHub       = lazy(() => import("./pages/ClientHub"));
const Regalos         = lazy(() => import("./pages/Regalos"));
const Ecommerce = lazy(() => import("./pages/Ecommerce"));
const EcommerceFloreria = lazy(() => import("./pages/EcommerceFloreria"));
import QRRedirect from "./pages/QRRedirect";

// ─── QUERY CLIENT ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — no refetch on remount
      gcTime:    1000 * 60 * 10,  // 10 min cache
      retry: 1,
    },
  },
});

import { ThemeProvider } from "./components/ThemeProvider";

// ─── APP ──────────────────────────────────────────────────────────────────────
const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="idenza-theme">
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              {/*
                ConditionalSpotlight must live inside BrowserRouter to access
                useLocation, and outside Suspense so it renders independently
                from page chunk loading.
              */}
              <ConditionalSpotlight />

              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Public site ── */}
                  <Route path="/"          element={<Index />} />
                  <Route path="/nosotros"  element={<Nosotros />} />
                  <Route path="/proyectos" element={<Proyectos />} />
                  <Route path="/planes"    element={<Planes />} />
                  <Route path="/crece"     element={<Crece />} />
                  <Route path="/onboarding/:token" element={<ClientOnboarding />} />
                  <Route path="/t/:token"          element={<TrackerView />} />
                  <Route path="/regalos"           element={<Regalos />} />
                  <Route path="/ecommerce"                  element={<Ecommerce />} />
                  <Route path="/ecommerce-floreria"         element={<EcommerceFloreria />} />

                  {/* ── QR Dinámico redirect — DEBE ir antes del catch-all ── */}
                  <Route path="/r/:slug"           element={<QRRedirect />} />

                  {/* ── Comunidad ── */}
                  <Route path="/comunidad"           element={<Comunidad />} />
                  <Route path="/comunidad/foro/:id"  element={<ForumTopic />} />
                  <Route path="/comunidad/:slug"     element={<PostView />} />

                  {/* ── CRM privado — solo acceso interno ── */}
                  {/* /hub redirige directo al login; ya no hay landing pública */}
                  <Route path="/hub"                  element={<Navigate to="/hub/login" replace />} />
                  <Route path="/hub/login"            element={<Login />} />
                  <Route path="/hub/forgot-password"  element={<ForgotPassword />} />
                  <Route path="/hub/update-password"  element={<UpdatePassword />} />
                  {/* /hub/dashboard ya no existe — cualquier URL antigua redirige al CRM cliente */}
                  <Route path="/hub/dashboard"        element={<Navigate to="/hub/client" replace />} />

                  {/* ── CRM Cliente ── */}
                  <Route path="/hub/client" element={
                    <ProtectedRoute>
                      <ClientHub />
                    </ProtectedRoute>
                  } />

                  {/* ── CRM Admin ── */}
                  <Route path="/hub-admin" element={
                    <ProtectedRoute requireAdmin>
                      <AdminHub />
                    </ProtectedRoute>
                  } />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              <PublicOnlyWidgets />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
