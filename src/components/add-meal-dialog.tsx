"use client";

import React, { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { addMealAction } from "@/lib/meals";
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

interface AddMealDialogProps {
  trigger?: React.ReactNode;
}

export function AddMealDialog({ trigger }: AddMealDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState<string>("");

  const { execute, status } = useAction(addMealAction, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setIsOpen(false);
        setName("");
        setDescription("");
        setImageUrl("");
        setPrice("");
      } else {
        toast.error(data.message || "Failed to add meal.");
      }
    },
    onError: (error) => {
      toast.error(
        error.serverError ||
          "An unexpected error occurred during meal addition."
      );
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
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3 shadow-md">
            Add New Meal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add a meal
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details to add a new meal to your menu.
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
              {isLoading ? "Adding..." : "Add Meal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
