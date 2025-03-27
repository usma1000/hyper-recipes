import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CookingTimer from "./CookingTimer";

type Cook = {
  date: string;
  time: string;
  rating: number;
  hasNotes: boolean;
};

const dummyData: Cook[] = [
  { date: "2024-01-15", time: "45m", rating: 4.5, hasNotes: true },
  { date: "2023-12-24", time: "50m", rating: 3.5, hasNotes: false },
  { date: "2023-11-30", time: "40m", rating: 5, hasNotes: true },
  { date: "2023-10-12", time: "55m", rating: 3, hasNotes: true },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map((value) => {
        const difference = value - rating;
        if (difference <= 0) {
          return <Star key={value} size={16} className="fill-current" />;
        } else if (difference > 0 && difference < 1) {
          return <StarHalf key={value} size={16} className="fill-current" />;
        } else {
          return <Star key={value} size={16} className="text-slate-200" />;
        }
      })}
    </div>
  );
}

export default function CookingHistory() {
  const hasPreviousCooks = dummyData.length > 0;

  return (
    <Card>
      <CardHeader className="space-y-1.5">
        <CardTitle>Cook Tracker</CardTitle>
        <CardDescription>
          {hasPreviousCooks
            ? `Cooked ${dummyData.length} ${dummyData.length === 1 ? "time" : "times"}`
            : "Ready to cook?"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPreviousCooks && (
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="cooking-history" className="border-none">
              <AccordionTrigger className="py-2">History</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {dummyData.map((cook, i) => (
                    <div
                      key={i}
                      className="flex flex-col space-y-1 border-b border-slate-100 pb-2 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(cook.date), "MMM d")}
                        </span>
                        <span className="text-sm">{cook.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <StarRating rating={cook.rating} />
                        {cook.hasNotes && (
                          <Button variant="link" className="h-6 p-0 text-xs">
                            Notes
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <CookingTimer />
      </CardContent>
    </Card>
  );
}
