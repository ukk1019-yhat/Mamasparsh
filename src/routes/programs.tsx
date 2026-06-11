import { createFileRoute } from "@tanstack/react-router";
import { ProgramsPage } from "@/components/site/ProgramsPage";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — MamaSparsh Preschool" },
      {
        name: "description",
        content:
          "Explore MamaSparsh's Early Years programs (2-5 years) and Cambridge IGCSE Grade programs in Kakinada.",
      },
    ],
  }),
  component: ProgramsPage,
});
