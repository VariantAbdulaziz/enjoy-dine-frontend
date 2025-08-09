"use client";

import React, { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { updateMealAction } from "@/actions/meals";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MealType } from "@/lib/validations/meals";

interface EditMealDialogProps {
  meal: MealType;
  trigger?: React.ReactNode;
}

export function EditMealDialog({ meal, trigger }: EditMealDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(meal.name);
  const [description, setDescription] = useState(meal.description);
  const [imageUrl, setImageUrl] = useState(meal.image);
  const [price, setPrice] = useState(String(meal.price));

  useEffect(() => {
    setName(meal.name);
    setDescription(meal.description);
    setImageUrl(meal.image);
    setPrice(String(meal.price));
  }, [meal]);

  const { execute, status } = useAction(updateMealAction, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success("Update success");
        setIsOpen(false);
      } else {
        toast.error("Failed to update meal.");
      }
    },
    onError: (error) => {
      toast.error("An unexpected error occurred during meal update.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl || !price) {
      toast.error("Please fill in all fields.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    execute({
      id: meal.id,
      name,
      description,
      imageUrl,
      price: parsedPrice,
    });
  };

  const isLoading = status === "executing";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-800 rounded-lg"
          >
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Edit meal
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Make changes to "{meal.name}" here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-gray-700">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right text-gray-700">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
              type="url"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right text-gray-700">
              Price
            </Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
              type="number"
              step="0.01"
              required
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
