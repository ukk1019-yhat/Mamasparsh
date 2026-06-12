import { createFileRoute } from "@tanstack/react-router";
import { AdventuresPage } from "@/components/site/AdventuresPage";
import { OG_IMAGE, OG_IMAGE_ALT, canonical } from "@/lib/seo";

const routeMeta = {
  path: "/adventures",
  title: "Adventures — MamaSparsh Preschool",
  desc: "Watch video reels from MamaSparsh Preschool in Kakinada — a day in the life of our little pandas, filled with learning, play, and discovery.",
};

export const Route = createFileRoute("/adventures")({
  head: () => ({
    meta: [
      { title: routeMeta.title },
      { name: "description", content: routeMeta.desc },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "MamaSparsh adventures, preschool videos Kakinada, daycare activities, early learning reels" },
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
  component: AdventuresPage,
});
