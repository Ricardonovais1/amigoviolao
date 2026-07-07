import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import VideoTestimonials from "@/components/VideoTestimonials";
import PromoBanner from "@/components/sales/PromoBanner";
import SalesHero from "@/components/sales/SalesHero";
import FeatureBadges from "@/components/sales/FeatureBadges";
import SalesWhyLearn from "@/components/sales/SalesWhyLearn";
import CourseModules from "@/components/sales/CourseModules";
import CommonMistakes from "@/components/sales/CommonMistakes";
import WhoIsItFor from "@/components/sales/WhoIsItFor";
import PricingCTA from "@/components/sales/PricingCTA";
import Faq from "@/components/sales/Faq";

export const metadata: Metadata = {
  title: "Curso de Violão para Crianças - Amigo Violão",
  description:
    "Desperte o talento musical de seu filho com o violão. O melhor curso de violão para crianças do Brasil, com o professor Ricardo Novais.",
};

export default function CursoParaCriancasPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PromoBanner />
        <SalesHero />
        <FeatureBadges />
        <SalesWhyLearn />
        <CourseModules />
        <VideoTestimonials />
        <CommonMistakes />
        <WhoIsItFor />
        <About />
        <PricingCTA />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
