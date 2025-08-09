"use server";

import {
  AddMealSchema,
  UpdateMealSchema,
  DeleteMealSchema,
  MealType,
} from "@/lib/validations/meals";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { ActionError } from "@/lib/unsafe-action";

export const addMealAction = authenticatedAction
  .schema(AddMealSchema)
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;
    let meal: MealType | undefined;

    try {
      const res = await api.post("/api/v1/dine/foods/Food", parsedInput);
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

export const updateMealAction = authenticatedAction
  .schema(UpdateMealSchema)
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;
    let meal: MealType | undefined;

    try {
      const res = await api.put(
        `/api/v1/dine/foods/${parsedInput.id}`,
        parsedInput
      );
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

export const deleteMealAction = authenticatedAction
  .schema(DeleteMealSchema)
  .action(async ({ ctx, parsedInput }) => {
    const _ = cookies();
    const { api } = ctx;

    try {
      await api.delete(`/api/v1/dine/foods/${parsedInput.id}`);

      return { success: true, message: "Meal deleted successfully!" };
    } catch (error) {
      throw new ActionError(
        error instanceof Error ? error.message : "Failed to delete meal"
      );
    } finally {
      revalidatePath("/");
    }
  });
