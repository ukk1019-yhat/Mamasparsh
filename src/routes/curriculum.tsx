import { createFileRoute } from "@tanstack/react-router";
import { CurriculumPage } from "@/components/site/CurriculumPage";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Curriculum — MamaSparsh Preschool" },
      {
        name: "description",
        content:
          "Explore MamaSparsh's Waldorf-inspired curriculum — 3F Nutrition, Banana Leaf Dining, Life Skills, and holistic early learning in Kakinada.",
      },
    ],
  }),
  component: CurriculumPage,
});
