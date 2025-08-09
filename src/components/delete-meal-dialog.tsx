"use client";

import React, { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { deleteMealAction } from "@/actions/meals";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MealType } from "@/lib/validations/meals";

interface DeleteMealDialogProps {
  meal: MealType;
}

export function DeleteMealDialog({ meal }: DeleteMealDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { execute, status } = useAction(deleteMealAction, {
    onSuccess: (data) => {
      if (data) {
        toast.success("delete success");
        setIsOpen(false);
      } else {
        toast.error(`Failed to delete meal "${meal.name}".`);
      }
    },
    onError: (error) => {
      toast.error("An unexpected error occurred during meal deletion.");
    },
  });

  const isLoading = status === "executing";

  const handleDelete = () => {
    execute({ id: meal.id });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="rounded-lg">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg p-6 bg-white shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-800">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold text-red-600">"{meal.name}"</span>{" "}
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex flex-col sm:flex-row-reverse gap-2 sm:gap-4">
          <AlertDialogCancel
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
