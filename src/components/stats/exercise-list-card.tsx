"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import axios from "@/lib/axios";
import {useAlert} from "@/components/alert/alert-provider";
import ExerciseDetailModal from "./exercise-detail-modal";
import {Clock, Flame, Plus} from "lucide-react";

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

interface ExerciseListCardProps {
    onExerciseUpdateAction: () => void;
}

export default function ExerciseListCard({ onExerciseUpdateAction }: ExerciseListCardProps) {
    const [exercises, setExercises] = useState<ExerciseItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const {showAlert} = useAlert();

    const fetchExercises = async (uid: string) => {
        const today = new Date().toISOString().split("T")[0];
        try {
            const {data} = await axios.get(`/api/calories/exercise/${uid}/date/${today}`);
            setExercises(data.payload || []);
        } catch {
            showAlert("Failed to load exercises", "error");
        }
    };

    useEffect(() => {
        const uid = sessionStorage.getItem("gym-sync-id");
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
        <Card className="w-full h-full flex flex-col card-dark">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <h2 className="text-lg font-semibold">Exercises</h2>
                {/*<div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">*/}
                {/*    <img src="/exercise-font.png" alt="Icon" className="h-auto w-40 object-contain"/>*/}
                {/*</div>*/}
                <div className="space-x-2 ml-auto">
                    <Button size="icon"
                            variant="outline"
                            onClick={() => setShowAddModal(true)}
                            className="cursor-pointer bg-transparent">
                        <Plus/>
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto no-scrollbar">
                {/* Grid layout for two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercises.map((item) => {
                        const detail = parseDetail(item.detail);

                        return (
                            <Card
                                key={item.id}
                                className="p-3 cursor-pointer hover:shadow-md card-light"
                                onClick={() => setSelectedExercise(item)}
                            >
                                <div className="space-y-1">
                                    {/* 1. Name */}
                                    <div className="font-medium text-base">{item.name}</div>

                                    {/* 2. Exercise + Intensity */}
                                    {detail && (
                                        <div className="text-sm text-muted-foreground">
                                            <div>
                                                {detail.intensity}
                                            </div>
                                        </div>

                                    )}

                                    {/* 3. Calories with Image */}
                                    <div className="text-sm font-semibold text-primary flex items-center space-x-1">
                                        <Flame style={{color: 'var(--highlight)'}} size={14}/>
                                        <span>{item.calories} cal</span>
                                    </div>

                                    {/* 4. Duration with Image */}
                                    {detail && (
                                        <div className="text-sm text-primary flex items-center space-x-1">
                                            <Clock style={{color: 'var(--highlight)'}} size={14}/>
                                            <span>{detail.duration} min</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}

                    {exercises.length === 0 && (
                        <div className="text-center text-muted-foreground py-4 col-span-2">
                            No exercises logged today.
                        </div>
                    )}
                </div>
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
                        onExerciseUpdateAction();
                        showAlert("Exercise updated", "success");
                    }}
                    onDelete={async () => {
                        await fetchExercises(userId);
                        setSelectedExercise(null);
                        onExerciseUpdateAction();
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
                        onExerciseUpdateAction();
                        showAlert("Exercise added", "success");
                    }}
                />
            )}
        </Card>
    );
}
