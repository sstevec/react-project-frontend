"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import axios from "@/lib/axios";
import {useAlert} from "@/components/alert/alert-provider";
import MealDetailModal from "./meal-detail-modal";
import {Plus} from "lucide-react";

type MealItem = {
    id: string;
    name: string;
    calories: number;
    detail: string;
};

type FoodItem = {
    foodName: string;
    amount: number;
    ingredients: {
        name: string;
        amount: number;
        caloriePerGram: number;
    }[];
};

interface MealListCardProps {
    onMealUpdateAction: () => void;
}

export default function MealListCard({onMealUpdateAction}: MealListCardProps) {
    const [meals, setMeals] = useState<MealItem[]>([]);
    const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const {showAlert} = useAlert();

    const fetchMeals = async (uid: string) => {
        const today = new Date().toISOString().split("T")[0];
        try {
            const {data} = await axios.get(`/api/calories/food/${uid}/date/${today}`);
            setMeals(data.payload || []);
        } catch (err) {
            showAlert("Failed to load meals", "error");
        }
    };

    useEffect(() => {
        const uid = sessionStorage.getItem("gym-sync-id");
        if (uid) {
            setUserId(uid);
            fetchMeals(uid);
        }
    }, []);

    const parseDetail = (detail: string): FoodItem[] => {
        try {
            return JSON.parse(detail);
        } catch {
            return [];
        }
    };

    return (
        <Card className="w-full min-w-[350px] h-full flex flex-col card-inline ">
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
                    <h2 className="text-lg font-semibold">Meals</h2>
                    {/*<img src="/meal-font.png" alt="Icon" className="h-auto w-40 object-contain"/>*/}
                </div>
                <div className="space-x-2 ml-auto">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setShowAddModal(true)}
                        className="cursor-pointer hover:bg-white"
                    >
                        <Plus/>
                    </Button>
                </div>
            </CardHeader>


            <CardContent className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {meals.map((meal) => {
                    const foods = parseDetail(meal.detail);

                    return (
                        <Card
                            key={meal.id}
                            className="cursor-pointer hover:shadow-lg transition-all card-dark"
                            onClick={() => setSelectedMeal(meal)}
                        >
                            <CardHeader>
                                <h3 className="font-semibold">{meal.name}</h3>
                                <p className="text-sm text-muted-foreground">Total: {meal.calories} cal</p>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {foods.map((food, index) => (
                                    <div key={index} className="text-sm">
                                        {food.foodName} - {food.amount}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
                {meals.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                        No meals logged today.
                    </div>
                )}
            </CardContent>

            {/* Edit Modal */}
            {selectedMeal && userId && (
                <MealDetailModal
                    mode="edit"
                    meal={selectedMeal}
                    userId={userId}
                    onClose={() => setSelectedMeal(null)}
                    onUpdate={async (updated) => {
                        await fetchMeals(userId);
                        setSelectedMeal(null);
                        onMealUpdateAction()
                        showAlert("Meal updated successfully!", "success");
                    }}
                    onDelete={(deletedId) => {
                        setMeals((prev) => prev.filter((m) => m.id !== deletedId));
                        showAlert("Meal deleted", "success");
                        onMealUpdateAction()
                        setSelectedMeal(null);
                    }}
                />
            )}

            {/* Add Modal */}
            {showAddModal && userId && (
                <MealDetailModal
                    mode="add"
                    userId={userId}
                    onClose={() => setShowAddModal(false)}
                    onAdd={async () => {
                        await fetchMeals(userId);
                        setShowAddModal(false);
                        onMealUpdateAction()
                        showAlert("Meal added successfully!", "success");
                    }}
                />
            )}
        </Card>
    );
}
