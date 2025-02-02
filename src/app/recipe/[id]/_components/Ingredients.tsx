"use client";

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

type PropTypes = {
  ingredients: {
    quantity: string;
    recipeId: number;
    ingredientId: number;
    ingredient: Ingredient;
  }[];
};

const Ingredients = ({ ingredients }: PropTypes) => {
  // Initialize state with false for all ingredients
  const [checkedStatus, setCheckedStatus] = useState<{
    [key: string]: boolean;
  }>(() => {
    const savedStatus = localStorage.getItem("ingredientCheckboxStatus");
    if (savedStatus) {
      const parsed = JSON.parse(savedStatus);
      // Merge saved status with initial false values for all ingredients
      return ingredients.reduce(
        (acc, { ingredient }) => ({
          ...acc,
          [ingredient.id]: parsed[ingredient.id] || false,
        }),
        {},
      );
    }
    // Initialize all ingredients with false if no saved status
    return ingredients.reduce(
      (acc, { ingredient }) => ({
        ...acc,
        [ingredient.id]: false,
      }),
      {},
    );
  });

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
              className="flex list-none items-center text-sm leading-tight"
              key={ingredient.id}
            >
              <input
                type="checkbox"
                checked={checkedStatus[ingredient.id.toString()]}
                onChange={() => handleCheckboxChange(ingredient.id.toString())}
              />
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" size="sm" className="font-semibold">
                    {ingredient.name}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div>{ingredient.description}</div>
                  <Button className="mt-4" size="sm">
                    <Plus size={16} /> Shopping List
                  </Button>
                </HoverCardContent>
              </HoverCard>
              <span>{quantity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button>
          <ShoppingCart size={16} className="mr-2" />
          My Shopping List
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Ingredients;
