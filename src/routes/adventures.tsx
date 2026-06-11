import { createFileRoute } from "@tanstack/react-router";
import { AdventuresPage } from "@/components/site/AdventuresPage";

export const Route = createFileRoute("/adventures")({
  head: () => ({
    meta: [
      { title: "Adventures — MamaSparsh Preschool" },
      {
        name: "description",
        content: "Watch video reels from MamaSparsh Preschool — a day in the life of our little pandas.",
      },
    ],
  }),
  component: AdventuresPage,
});
