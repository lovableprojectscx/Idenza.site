import { lazy, Suspense } from 'react';

/*
  ABOVE THE FOLD — loaded eagerly.
  Navbar + HeroSection are the LCP candidates; they must be in the initial
  chunk so the browser can paint them without waiting for any dynamic import.
*/
import Navbar      from '@/components/idenza/Navbar';
import HeroSection from '@/components/idenza/HeroSection';

/*
  BELOW THE FOLD — lazy-loaded.
  Each section is a separate dynamic import. The browser only fetches a
  section's JS when React needs to render it (i.e. after the above-fold
  content has already painted). This keeps the initial chunk small and
  directly improves LCP + TTI.
*/
const SocialProofSection = lazy(() => import('@/components/idenza/SocialProofSection'));
const ProblemSection     = lazy(() => import('@/components/idenza/ProblemSection'));
const HowItWorksSection  = lazy(() => import('@/components/idenza/HowItWorksSection'));
const ProjectShowcase    = lazy(() => import('@/components/idenza/ProjectShowcase'));
const ServicesSection    = lazy(() => import('@/components/idenza/ServicesSection'));
const PricingPreview     = lazy(() => import('@/components/idenza/PricingPreview'));
const ScalabilitySection = lazy(() => import('@/components/idenza/ScalabilitySection'));
const IdenzaHubSection   = lazy(() => import('@/components/idenza/IdenzaHubSection'));
const CTASection         = lazy(() => import('@/components/idenza/CTASection'));
const Footer             = lazy(() => import('@/components/idenza/Footer'));

/*
  Minimal skeleton shown while a section chunk loads.
  Pure CSS, no dependencies — must stay weightless.
  Height approximates section height to prevent layout shift (CLS).
*/
const SectionSkeleton = () => (
  <div
    className="w-full flex items-center justify-center"
    style={{ minHeight: "12rem" }}
    aria-hidden="true"
  >
    <div className="w-16 h-px bg-white/10 rounded-full animate-pulse" />
  </div>
);

const Index = () => (
  <div className="min-h-screen text-foreground overflow-x-hidden">
    {/* Critical path — painted immediately */}
    <Navbar />
    <HeroSection />

    {/* Deferred sections — each wrapped in its own Suspense so a slow
        network on one section does not block the render of the next */}
    <Suspense fallback={<SectionSkeleton />}>
      <SocialProofSection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <ProblemSection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <HowItWorksSection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <ProjectShowcase />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <ServicesSection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <PricingPreview />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <ScalabilitySection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <IdenzaHubSection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <CTASection />
    </Suspense>

    <Suspense fallback={<SectionSkeleton />}>
      <Footer />
    </Suspense>
  </div>
);

export default Index;
