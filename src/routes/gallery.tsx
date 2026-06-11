import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/site/GalleryPage";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — MamaSparsh Preschool" },
      {
        name: "description",
        content:
          "Browse photos from MamaSparsh Preschool — moments of play, learning, and growth.",
      },
    ],
  }),
  component: GalleryPage,
});
