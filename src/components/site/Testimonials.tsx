import { MessageCircle, User } from "lucide-react";
import { Reveal } from "./Reveal";

const testimonials = [
  { name: "Akula Praveen Kumar", child: "Parent", text: "The teachers are caring, the classrooms are very colourful, and my child loves going to school. The curriculum is well balanced, focusing on both fun and learning. Dr. Lavanya Mam is highly experienced." },
  { name: "Chinnarao Gedela", child: "Parent", text: "My child has improved significantly after joining MamaSparsh. The school provides a nurturing and stimulating environment that encourages both academic and personal growth." },
  { name: "Anusha Gollapalli", child: "Parent", text: "We are incredibly happy with MamaSparsh! The teachers are nurturing, patient, and truly dedicated to each child's growth. The curriculum blends academics with fun activities." },
  { name: "Avinash", child: "Parent", text: "As a mother, I am beyond impressed. My daughter absolutely loves going to school every day! The staff is warm, caring, and highly dedicated to the kids' overall growth." },
  { name: "Praveen Pedaballi", child: "Parent", text: "MamaSparsh encourages children to try their best, persist through challenges, and highlights desirable behaviour and academic milestones." },
  { name: "Aruna Jinaga", child: "Parent", text: "My son loves going there every day. The teachers are so caring and patient. I've seen so much positive change — he's more confident, active, and happy." },
  { name: "Abhishek Padala", child: "Parent", text: "Best playschool with a very good activity based curriculum and qualified, caring teachers. I have seen a lot of improvement in our kid within a short span." },
  { name: "Jessy Chetla", child: "Parent", text: "I wholeheartedly recommend MamaSparsh to any family seeking a high-quality education with a strong focus on a child's well-being and holistic development." },
  { name: "Machiraju Rajasree", child: "Parent", text: "My son has improved a lot. It's all activity based rather than just classroom teaching. They have a well structured academics along with constant activities." },
  { name: "Manibabu Ganisetti", child: "Parent", text: "Greetings to all the staff for creating a different world for children in Kakinada. Very nice atmosphere, awesome and good caring from staff. I am very happy as a parent!" },
  { name: "Siva Reddy", child: "Parent", text: "MamaSparsh Play School in Kakinada is an excellent place for young children. A wonderful learning environment for holistic development." },
  { name: "Durgajhanai Eeta", child: "Parent", text: "Excellent school! Taking so much care and teaching is excellent with lots of activities with fun and study at a time. My son improved a lot and enjoys school." },
];

function Bubble({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="mx-3 w-[320px] flex-none rounded-3xl border border-border bg-card p-6 shadow-soft">
      <p className="font-body text-foreground/80">"{t.text}"</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-blush text-primary-foreground"><User size={20} /></span>
        <div>
          <p className="font-display font-extrabold text-foreground">{t.name}</p>
          <p className="font-body text-sm text-primary">Parent · {t.child}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];
  return (
    <section id="testimonials" className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 font-display text-sm font-bold text-primary shadow-soft">
            <MessageCircle size={16} /> Parent Testimonials
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            What MamaSparsh Means to Our Families
          </h2>
        </Reveal>
      </div>

      <div className="group relative mt-14 overflow-hidden">
        <div
          className="flex w-max"
          style={{ animation: "marquee 38s linear infinite" }}
        >
          {loop.map((t, i) => (
            <Bubble key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
