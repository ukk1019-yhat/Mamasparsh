import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { AmbientLayer } from "@/components/site/AmbientLayer";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { LearnDifferently } from "@/components/site/LearnDifferently";
import { Adventures } from "@/components/site/Adventures";
import { Curriculum } from "@/components/site/Curriculum";
import { WhyChoose } from "@/components/site/WhyChoose";
import { DayTimeline } from "@/components/site/DayTimeline";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Admissions } from "@/components/site/Admissions";
import { Contact } from "@/components/site/Contact";
import { FooterNight } from "@/components/site/FooterNight";
import { canonical } from "@/lib/seo";

const routeMeta = {
  path: "/",
  title: "MamaSparsh Preschool — A Mother's Touch for Every Little Dream",
  desc: "Step into the MamaSparsh Panda World — a premium, nurturing preschool where children read, write, paint, dance, explore and grow through nature-inspired, child-centric learning in Kakinada.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: routeMeta.title },
      { name: "description", content: routeMeta.desc },
      { property: "og:title", content: routeMeta.title },
      { property: "og:description", content: routeMeta.desc },
      { property: "og:url", content: canonical(routeMeta.path) },
      { name: "twitter:title", content: routeMeta.title },
      { name: "twitter:description", content: routeMeta.desc },
    ],
    links: [{ rel: "canonical", href: canonical(routeMeta.path) }],
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
        <Curriculum />
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
