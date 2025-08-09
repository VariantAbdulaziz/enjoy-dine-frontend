"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddMealDialog } from "./add-meal-dialog";
import { EditMealDialog } from "./edit-meal-dialog";
import { DeleteMealDialog } from "./delete-meal-dialog";
import { MealType } from "@/lib/validations/meals";

interface FeaturedMealsProps {
  meals: MealType[];
}

export function FeaturedMeals({ meals }: FeaturedMealsProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Featured Meals</h2>
        <AddMealDialog />
      </div>

      {meals.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No meals available. Add some!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={meal.image || "/placeholder.png"}
                  alt={meal.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/150x150/fdba74/8c4c0a?text=Image+Error`;
                    e.currentTarget.alt = "Image not available";
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 truncate">
                  {meal.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {meal.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-orange-600">
                    ${meal.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <EditMealDialog meal={meal}>
                    <Button
                      variant="outline"
                      className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-lg py-2 px-4 transition duration-200"
                    >
                      Edit
                    </Button>
                  </EditMealDialog>
                  <DeleteMealDialog meal={meal}>
                    <Button
                      variant="destructive"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 transition duration-200"
                    >
                      Delete
                    </Button>
                  </DeleteMealDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
