import { createFileRoute } from "@tanstack/react-router";
import { CurriculumPage } from "@/components/site/CurriculumPage";
import { SITE, OG_IMAGE, canonical, jsonLdScripts } from "@/lib/seo";

const routeMeta = {
  path: "/curriculum",
  title: "Curriculum — MamaSparsh Preschool",
  desc: "Discover MamaSparsh's Waldorf-inspired curriculum in Kakinada — 3F Nutrition, Banana Leaf Dining, Life Skills, and holistic early learning that nurtures Head, Heart & Hands.",
};

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: routeMeta.title },
      { name: "description", content: routeMeta.desc },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "MamaSparsh curriculum, Waldorf-inspired preschool, 3F nutrition, banana leaf dining, life skills, holistic education Kakinada" },
      { property: "og:title", content: routeMeta.title },
      { property: "og:description", content: routeMeta.desc },
      { property: "og:url", content: canonical(routeMeta.path) },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:title", content: routeMeta.title },
      { name: "twitter:description", content: routeMeta.desc },
    ],
    links: [{ rel: "canonical", href: canonical(routeMeta.path) }],
  }),
  component: CurriculumPage,
});
