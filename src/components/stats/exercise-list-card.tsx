"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useAlert } from "@/components/alert/alert-provider";
import ExerciseDetailModal from "./exercise-detail-modal";

interface ExerciseItem {
    id: string;
    name: string;
    detail: string;
    calories: number;
}

interface ParsedDetail {
    exercise: string;
    intensity: string;
    metValue: number;
    duration: number;
}

export default function ExerciseListCard() {
    const [exercises, setExercises] = useState<ExerciseItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const { showAlert } = useAlert();

    const fetchExercises = async (uid: string) => {
        const today = new Date().toISOString().split("T")[0];
        try {
            const { data } = await axios.get(`/api/calories/exercise/${uid}/date/${today}`);
            setExercises(data.payload || []);
        } catch {
            showAlert("Failed to load exercises", "error");
        }
    };

    useEffect(() => {
        const uid = localStorage.getItem("gym-sync-id");
        if (uid) {
            setUserId(uid);
            fetchExercises(uid);
        }
    }, []);

    const parseDetail = (detail: string): ParsedDetail | null => {
        try {
            return JSON.parse(detail);
        } catch {
            return null;
        }
    };

    return (
        <Card className="w-full min-w-[350px] h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <h2 className="text-lg font-semibold">Exercises</h2>
                <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setShowAddModal(true)}>+ Add</Button>
                    <Button size="sm" variant="secondary">History</Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-3">
                {exercises.map((item) => {
                    const detail = parseDetail(item.detail);

                    return (
                        <Card
                            key={item.id}
                            className="p-3 cursor-pointer hover:shadow-md"
                            onClick={() => setSelectedExercise(item)}
                        >
                            <div className="font-medium text-base flex justify-between">
                                <span>{item.name}</span>
                                <span>{item.calories} cal</span>
                            </div>
                            {detail && (
                                <div className="text-sm text-muted-foreground">
                                    {detail.exercise} · {detail.intensity} · {detail.duration} min
                                </div>
                            )}
                        </Card>
                    );
                })}

                {exercises.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                        No exercises logged today.
                    </div>
                )}
            </CardContent>

            {/* Edit Modal */}
            {selectedExercise && userId && (
                <ExerciseDetailModal
                    mode="edit"
                    exercise={selectedExercise}
                    userId={userId}
                    onClose={() => setSelectedExercise(null)}
                    onUpdate={async () => {
                        await fetchExercises(userId);
                        setSelectedExercise(null);
                        showAlert("Exercise updated", "success");
                    }}
                    onDelete={async () => {
                        await fetchExercises(userId);
                        setSelectedExercise(null);
                        showAlert("Exercise deleted", "success");
                    }}
                />
            )}

            {/* Add Modal */}
            {showAddModal && userId && (
                <ExerciseDetailModal
                    mode="add"
                    userId={userId}
                    onClose={() => setShowAddModal(false)}
                    onAdd={async () => {
                        await fetchExercises(userId);
                        setShowAddModal(false);
                        showAlert("Exercise added", "success");
                    }}
                />
            )}
        </Card>
    );
}