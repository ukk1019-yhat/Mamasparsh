import { createFileRoute } from "@tanstack/react-router";
import { ProgramsPage } from "@/components/site/ProgramsPage";
import { OG_IMAGE, OG_IMAGE_ALT, canonical } from "@/lib/seo";

const routeMeta = {
  path: "/programs",
  title: "Programs — MamaSparsh Preschool",
  desc: "Explore MamaSparsh's Early Years programs (ages 2-5) in Kakinada. Reggio Emilia inspired curriculum with a focus on holistic development, creative exploration, and school readiness.",
};

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: routeMeta.title },
      { name: "description", content: routeMeta.desc },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "MamaSparsh programs, preschool programs Kakinada, Early Years, Reggio Emilia, nursery, kindergarten, daycare Kakinada" },
      { property: "og:title", content: routeMeta.title },
      { property: "og:description", content: routeMeta.desc },
      { property: "og:url", content: canonical(routeMeta.path) },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:title", content: routeMeta.title },
      { name: "twitter:description", content: routeMeta.desc },
    ],
    links: [{ rel: "canonical", href: canonical(routeMeta.path) }],
  }),
  component: ProgramsPage,
});
