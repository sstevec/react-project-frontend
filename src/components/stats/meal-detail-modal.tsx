"use client";

import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import axios from "@/lib/axios";
import {useAlert} from "@/components/alert/alert-provider";
import {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";

import CustomCombobox from "@/components/ui/custom-combobox";

interface Ingredient {
    name: string;
    amount: number;
    caloriePerGram: number;
}

interface FoodItem {
    foodName: string;
    amount: number;
    ingredients: Ingredient[];
}

interface MealItem {
    id: string;
    name: string;
    calories: number;
    detail: string;
}

type Props = {
    mode: "edit" | "add";
    meal?: MealItem;
    userId: string;
    onClose: () => void;
    onUpdate?: (updated: MealItem) => void;
    onDelete?: (deletedId: string) => void;
    onAdd?: () => void;
};

export default function MealDetailModal({
                                            mode,
                                            meal,
                                            userId,
                                            onClose,
                                            onUpdate,
                                            onDelete,
                                            onAdd,
                                        }: Props) {
    const {showAlert} = useAlert();
    const [mealName, setMealName] = useState(meal?.name || "");
    const [foods, setFoods] = useState<FoodItem[]>(() => (meal ? JSON.parse(meal.detail) : []));
    const [presets, setPresets] = useState<string[]>([]);

    useEffect(() => {
        axios.get("/api/calories/food/list").then(({data}) => setPresets(data));
    }, []);

    const addFoodItem = () => {
        setFoods((prev) => [...prev, {foodName: "", amount: 1, ingredients: []}]);
    };

    const removeFoodItem = (foodIndex: number) => {
        setFoods((prev) => prev.filter((_, idx) => idx !== foodIndex));
    };

    const addIngredient = (foodIndex: number) => {
        setFoods((prev) => {
            const updated = [...prev];
            updated[foodIndex] = {
                ...updated[foodIndex],
                ingredients: [...updated[foodIndex].ingredients, {name: "", amount: 0, caloriePerGram: 0}]
            };
            return updated;
        });
    };

    const removeIngredient = (foodIndex: number, ingIndex: number) => {
        setFoods((prev) =>
            prev.map((food, i) =>
                i === foodIndex
                    ? {
                        ...food,
                        ingredients: food.ingredients.filter((_, j) => j !== ingIndex),
                    }
                    : food
            )
        );
    };


    const handlePresetSelect = async (foodIndex: number, presetName: string) => {
        try {
            const {data} = await axios.get(`/api/calories/food/detail/${presetName}`);
            setFoods((prev) => {
                const updated = [...prev];
                updated[foodIndex].foodName = presetName;
                updated[foodIndex].ingredients = data;
                return updated;
            });
        } catch {
            showAlert("Failed to load preset details", "error");
        }
    };

    const handleConfirm = async () => {
        const isValid = foods.every(f => f.amount > 0 && f.foodName.trim() !== "");
        if (!isValid) {
            showAlert("Please ensure all food items have a name and positive amount.", "warning");
            return;
        }

        try {
            if (mode === "edit" && meal) {
                const newDetail = JSON.stringify(foods);
                await axios.put(`/api/calories/food/${userId}/${meal.id}`, {
                    newName: mealName,
                    newDetail,
                });
                onUpdate?.({...meal, name: mealName, detail: newDetail});
            } else if (mode === "add") {
                await axios.post("/api/calories/food", {
                    userId,
                    customName: mealName,
                    foodItems: foods,
                });
                onAdd?.();
            }
        } catch {
            showAlert("Failed to save meal", "error");
        }
    };

    const handleDelete = async () => {
        if (!meal) return;
        if (!window.confirm("Are you sure you want to delete this meal?")) return;
        try {
            await axios.delete(`/api/calories/${userId}/${meal.id}`);
            onDelete?.(meal.id);
        } catch {
            showAlert("Failed to delete meal", "error");
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Meal" : "Add New Meal"}</DialogTitle>
                </DialogHeader>

                <Button size="sm" variant="outline" onClick={addFoodItem} className="mb-4">
                    + Add Food Item
                </Button>

                <div className="space-y-4">
                    <div>
                        <Label>Meal Name</Label>
                        <Input value={mealName} onChange={(e) => setMealName(e.target.value)}/>
                    </div>

                    {foods.map((food, idx) => (
                        <div key={idx} className="border rounded p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Item {idx + 1}</Label>
                                <Button variant="ghost" size="sm" onClick={() => removeFoodItem(idx)}>🗑️</Button>
                            </div>
                            <CustomCombobox
                                options={presets}
                                value={food.foodName}
                                onChange={(val) => handlePresetSelect(idx, val)}
                                placeholder="Select or enter food name"
                            />
                            <Input
                                type="number"
                                value={food.amount}
                                onChange={(e) => {
                                    const amount = parseFloat(e.target.value);
                                    if (amount > 0)
                                        setFoods((prev) => prev.map((f, i) => (i === idx ? {...f, amount} : f)));
                                }}
                                placeholder="Amount"
                            />

                            <div className="pl-4">
                                <Label>Ingredients</Label>
                                {food.ingredients.map((ing, ingIdx) => (
                                    <div key={ingIdx} className="flex gap-2 items-center">
                                        <Input
                                            value={ing.name}
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                setFoods((prev) => {
                                                    const updated = [...prev];
                                                    updated[idx].ingredients[ingIdx].name = name;
                                                    return updated;
                                                });
                                            }}
                                            placeholder="Name"
                                        />
                                        <div className="flex items-center gap-1">
                                            <Input
                                                className="w-min-20"
                                                type="number"
                                                value={ing.amount}
                                                onChange={(e) => {
                                                    const amount = parseFloat(e.target.value);
                                                    setFoods((prev) => {
                                                        const updated = [...prev];
                                                        updated[idx].ingredients[ingIdx].amount = amount;
                                                        return updated;
                                                    });
                                                }}
                                                placeholder="Amount"
                                            />
                                            <span>g</span>
                                        </div>
                                        <Input
                                            className="w-20"
                                            type="number"
                                            value={ing.caloriePerGram}
                                            onChange={(e) => {
                                                const cal = parseFloat(e.target.value);
                                                setFoods((prev) => {
                                                    const updated = [...prev];
                                                    updated[idx].ingredients[ingIdx].caloriePerGram = cal;
                                                    return updated;
                                                });
                                            }}
                                            placeholder="Cal/g"
                                        />
                                        <Button variant="ghost" size="sm" onClick={() => removeIngredient(idx, ingIdx)}>
                                            ✖
                                        </Button>
                                    </div>
                                ))}
                                <Button size="sm" onClick={() => addIngredient(idx)} className="mt-2">
                                    + Add Ingredient
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="mt-4">
                    {mode === "edit" ? (
                        <>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleConfirm}>Save Changes</Button>
                        </>
                    ) : (
                        <>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleConfirm}>Confirm</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
