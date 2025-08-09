import { z } from "zod";

const MealSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  rating: z.number(),
  categoryColor: z.string(),
  category: z.enum([
    "Italian",
    "Healthy",
    "Breakfast",
    "Dessert",
    "Grill",
    "Fast Food",
    "Indian",
    "Seafood",
  ]),
  image: z.string().optional(),
  restaurant: z.number(),
});

export const AddMealSchema = MealSchema.omit({
  id: true,
  rating: true,
  categoryColor: true,
  restaurant: true,
});
export const UpdateMealSchema = MealSchema.omit({
  rating: true,
  categoryColor: true,
  restaurant: true,
});
export const DeleteMealSchema = MealSchema.pick({ id: true });

export type MealType = z.infer<typeof MealSchema>;
