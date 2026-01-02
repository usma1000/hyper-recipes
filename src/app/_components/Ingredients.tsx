"use client";

import { SignedIn } from "@clerk/nextjs";
import { Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PropTypes = {
  ingredients: {
    quantity: string;
    recipeId: number;
    ingredientId: number;
    ingredient: Ingredient;
  }[];
  showCheckboxes?: boolean;
};

const Ingredients = ({ ingredients, showCheckboxes = false }: PropTypes) => {
  const [checkedStatus, setCheckedStatus] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const savedStatus = localStorage.getItem("ingredientCheckboxStatus");
    if (savedStatus) {
      const parsed = JSON.parse(savedStatus) as Record<string, boolean>;
      setCheckedStatus(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ingredientCheckboxStatus",
      JSON.stringify(checkedStatus),
    );
  }, [checkedStatus]);

  const handleCheckboxChange = (id: string) => {
    setCheckedStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="m-0">
          {ingredients.length === 0 && (
            <span className="text-sm">
              Oops. Someone forgot to add the ingredients.
            </span>
          )}
          {ingredients.map(({ ingredient, quantity }) => (
            <li
              className="my-4 flex list-none items-start text-sm leading-tight"
              key={ingredient.id}
            >
              {showCheckboxes && (
                <input
                  type="checkbox"
                  className="mr-2 mt-1"
                  checked={checkedStatus[ingredient.id.toString()]}
                  onChange={() =>
                    handleCheckboxChange(ingredient.id.toString())
                  }
                />
              )}
              <div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="link"
                      size="sm"
                      className="mr-2 h-auto px-0 font-semibold"
                    >
                      {ingredient.name}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div>{ingredient.description}</div>
                    <SignedIn>
                      <Button className="mt-4" size="sm">
                        <Plus size={16} /> Grocery List
                      </Button>
                    </SignedIn>
                  </HoverCardContent>
                </HoverCard>
                <span>{quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <SignedIn>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <ShoppingCart size={16} className="mr-2" />
                My Grocery List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Coming Soon!</DialogTitle>
                <DialogDescription>
                  The grocery list feature is currently under development. Check
                  back soon!
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </SignedIn>
    </Card>
  );
};

export default Ingredients;
