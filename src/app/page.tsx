import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AudienceStrip from "@/components/AudienceStrip";
import WhyLearn from "@/components/WhyLearn";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import VideoTestimonials from "@/components/VideoTestimonials";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <AudienceStrip />
        <WhyLearn />
        <Testimonials />
        <HowItWorks />
        <VideoTestimonials aspect="video" />
        <About />
      </main>
      <Footer />
    </>
  );
}
