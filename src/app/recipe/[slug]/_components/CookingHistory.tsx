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
      <CardHeader>
        <CardTitle>Your Past Cooks</CardTitle>
        <CardDescription>
          {hasPreviousCooks
            ? `You've cooked this recipe ${dummyData.length} ${dummyData.length === 1 ? "time" : "times"}`
            : "You haven't cooked this recipe yet. Let's fix that today!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPreviousCooks && (
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="cooking-history">
              <AccordionTrigger>View History</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Date
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Time
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rating
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Notes
                  </div>
                  {dummyData.map((cook, i) => (
                    <>
                      <span className="py-2 text-sm">
                        {format(new Date(cook.date), "MMM d, yyyy")}
                      </span>
                      <span className="py-2 text-sm">{cook.time}</span>
                      <div className="py-2">
                        <StarRating rating={cook.rating} />
                      </div>
                      <div className="py-2">
                        {cook.hasNotes && (
                          <Button variant="link" className="h-auto p-0">
                            View
                          </Button>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <Button>{hasPreviousCooks ? "Cook Again" : "Start Cooking"}</Button>
      </CardContent>
    </Card>
  );
}
