"use server";

import {
  AddMealSchema,
  UpdateMealSchema,
  DeleteMealSchema,
  MealType,
} from "@/lib/validations/meals";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ActionError, unauthenticatedAction } from "@/lib/unsafe-action";
import z from "zod";

export const getMealsAction = unauthenticatedAction
  .schema(z.void())
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;
    let meals: MealType[];

    try {
      const res = await api.post("/dine/foods", parsedInput);
      meals = res.data.result || [];

      return { success: true, message: "Meal added successfully!", meals };
    } catch (error) {
      throw new ActionError(
        error instanceof Error ? error.message : "Failed to add meal"
      );
    } finally {
      revalidatePath("/");
    }
  });

export const addMealAction = unauthenticatedAction
  .schema(AddMealSchema)
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;
    let meal: MealType | undefined;

    try {
      const res = await api.post("/dine/foods", parsedInput);
      meal = res.data;

      return { success: true, message: "Meal added successfully!", meal };
    } catch (error) {
      throw new ActionError(
        error instanceof Error ? error.message : "Failed to add meal"
      );
    } finally {
      revalidatePath("/");
    }
  });

export const updateMealAction = unauthenticatedAction
  .schema(UpdateMealSchema)
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;
    let meal: MealType | undefined;

    try {
      const res = await api.put(`/dine/foods/${parsedInput.id}`, parsedInput);
      meal = res.data;

      return { success: true, message: "Meal updated successfully!", meal };
    } catch (error) {
      throw new ActionError(
        error instanceof Error ? error.message : "Failed to update meal"
      );
    } finally {
      revalidatePath("/");
    }
  });

export const deleteMealAction = unauthenticatedAction
  .schema(DeleteMealSchema)
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;

    try {
      await api.delete(`/dine/foods/${parsedInput.id}`);

      return { success: true, message: "Meal deleted successfully!" };
    } catch (error) {
      throw new ActionError(
        error instanceof Error ? error.message : "Failed to delete meal"
      );
    } finally {
      revalidatePath("/");
    }
  });
