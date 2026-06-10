import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { AmbientLayer } from "@/components/site/AmbientLayer";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { LearnDifferently } from "@/components/site/LearnDifferently";
import { Adventures } from "@/components/site/Adventures";
import { WhyChoose } from "@/components/site/WhyChoose";
import { DayTimeline } from "@/components/site/DayTimeline";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Admissions } from "@/components/site/Admissions";
import { Contact } from "@/components/site/Contact";
import { FooterNight } from "@/components/site/FooterNight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MamaSparsh Preschool — A Mother's Touch for Every Little Dream" },
      {
        name: "description",
        content:
          "Step into the MamaSparsh Panda World — a premium, nurturing preschool where children read, write, paint, dance, explore and grow through nature-inspired, child-centric learning.",
      },
      { property: "og:title", content: "MamaSparsh Preschool — The Panda World" },
      {
        property: "og:description",
        content: "A mother's touch for every little dream. Premium, nature-inspired early learning.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SmoothScroll />
      <AmbientLayer />
      <Navbar />
      <main>
        <Hero />
        <LearnDifferently />
        <Adventures />
        <WhyChoose />
        <DayTimeline />
        <Gallery />
        <Testimonials />
        <Admissions />
        <Contact />
      </main>
      <FooterNight />
    </>
  );
}
