import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/site/GalleryPage";
import { SITE, canonical } from "@/lib/seo";

const routeMeta = {
  path: "/gallery",
  title: "Photo Gallery — MamaSparsh Preschool",
  desc: "Browse photos from MamaSparsh Preschool in Kakinada — precious moments of play, learning, creative exploration, and growth captured every day.",
};

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: routeMeta.title },
      { name: "description", content: routeMeta.desc },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "MamaSparsh gallery, preschool photos Kakinada, daycare pictures, early learning moments" },
      { property: "og:title", content: routeMeta.title },
      { property: "og:description", content: routeMeta.desc },
      { property: "og:url", content: canonical(routeMeta.path) },
      { property: "og:image", content: `${SITE.domain}/og-image.jpg` },
      { name: "twitter:title", content: routeMeta.title },
      { name: "twitter:description", content: routeMeta.desc },
    ],
    links: [{ rel: "canonical", href: canonical(routeMeta.path) }],
  }),
  component: GalleryPage,
});
