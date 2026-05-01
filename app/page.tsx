import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import ServiceArea from "@/components/ServiceArea";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/MotionRoot";

export const metadata: Metadata = {
  title: "Surgical Mobile Detailing · Concours Shine in Your Driveway",
  description:
    "Fluid Precision delivers concours-grade ceramic coatings, paint correction, and interior restoration on-site. IDA-certified specialists. Miami's 20-mile concierge radius.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fluid Precision · Surgical Mobile Detailing",
    description:
      "Concours-grade mobile detailing. Ceramic coatings, paint correction, restoration — delivered to your driveway.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <MotionRoot>
      <Navbar />
      <main id="main" className="relative" aria-label="Fluid Precision homepage">
        <Hero />
        <Services />
        <Portfolio />
        <Testimonials />
        <Booking />
        <ServiceArea />
        <FAQ />
        <About />
      </main>
      <Footer />
    </MotionRoot>
  );
}
