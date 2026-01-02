import { Sliders, ChefHat, FileX, ShieldCheck } from "lucide-react";

type ValuePoint = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const VALUE_POINTS: ValuePoint[] = [
  {
    icon: <Sliders className="h-5 w-5" />,
    title: "Recipes adapt to you",
    description: "Static blogs don't adjust. Hyper Recipes does.",
  },
  {
    icon: <ChefHat className="h-5 w-5" />,
    title: "Built for real cooking decisions",
    description:
      "Swap ingredients, scale servings, and adjust time without breaking the recipe.",
  },
  {
    icon: <FileX className="h-5 w-5" />,
    title: "No fluff, no life stories",
    description: "Just clear steps, smart structure, and helpful guidance.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Cook with confidence",
    description:
      "Know what matters at each step—and what to do if things go wrong.",
  },
];

/**
 * Value proposition section highlighting why Hyper Recipes is better than recipe blogs.
 * Four key points with icons in a grid layout.
 */
export function WhyBetterSection(): JSX.Element {
  return (
    <section>
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
          Why Hyper Recipes beats traditional recipe blogs
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {VALUE_POINTS.map((point) => (
          <div
            key={point.title}
            className="rounded-2xl border border-neutral-200/60 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              {point.icon}
            </div>
            <h3 className="mb-2 text-[16px] font-semibold tracking-tight text-neutral-900 dark:text-white">
              {point.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

