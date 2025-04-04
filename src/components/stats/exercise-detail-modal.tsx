"use client";

import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {useAlert} from "@/components/alert/alert-provider";
import CustomCombobox from "@/components/ui/custom-combobox";

interface Props {
    mode: "edit" | "add";
    userId: string;
    exercise?: {
        id: string;
        name: string;
        calories: number;
        detail: string;
    };
    onClose: () => void;
    onUpdate?: () => void;
    onDelete?: () => void;
    onAdd?: () => void;
}

export default function ExerciseDetailModal({
                                                mode,
                                                userId,
                                                exercise,
                                                onClose,
                                                onUpdate,
                                                onDelete,
                                                onAdd,
                                            }: Props) {
    const {showAlert} = useAlert();
    const [name, setName] = useState(exercise?.name || "");
    const [exerciseList, setExerciseList] = useState<string[]>([]);
    const [intensityList, setIntensityList] = useState<string[]>([]);
    const [presetData, setPresetData] = useState<{ intensity: string; metValue: number }[]>([]);
    const [exerciseName, setExerciseName] = useState("");
    const [intensity, setIntensity] = useState("");
    const [metValue, setMetValue] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        axios.get("/api/calories/exercise/list").then(({data}) => setExerciseList(data));

        if (exercise) {
            try {
                const parsed = JSON.parse(exercise.detail);
                setExerciseName(parsed.exercise);
                setIntensity(parsed.intensity);
                setMetValue(parsed.metValue);
                setDuration(parsed.duration);
            } catch {
                showAlert("Invalid detail data.", "error");
            }
        }
    }, [exercise]);

    const handlePresetSelect = async (name: string) => {
        setExerciseName(name);
        setIntensity("");
        setMetValue(0);
        try {
            const {data} = await axios.get(`/api/calories/exercise/${name}`);
            if (data.length > 0) {
                const intensities = data.map((entry: any) => entry.intensity);
                setPresetData(data);
                setIntensityList(intensities);
            }
        } catch {
            showAlert("Failed to load exercise preset", "error");
        }
    };

    const handleIntensitySelect = (val: string) => {
        setIntensity(val);
        const found = presetData.find((p) => p.intensity === val);
        if (found) setMetValue(found.metValue);
    };

    const handleSave = async () => {
        const detail = JSON.stringify({exercise: exerciseName, intensity, metValue, duration});
        if (!name.trim()) {
            showAlert("Name is required", "error");
            return;
        }
        if (name.length > 15) {
            showAlert("Name is too long", "error");
            return;
        }
        if (!exerciseName.trim()) {
            showAlert("Exercise name is required", "error");
            return;
        }
        if (!intensity.trim()) {
            showAlert("Intensity is required", "error");
            return;
        }
        if (!metValue || metValue <= 0) {
            showAlert("Met Value must be greater than 0", "error");
            return;
        }
        if (!duration || duration <= 0) {
            showAlert("Duration must be greater than 0", "error");
            return;
        }

        try {
            if (mode === "edit" && exercise) {
                await axios.put(`/api/calories/exercise/${userId}/${exercise.id}`, {
                    newName: name,
                    newDetail: detail,
                });
                onUpdate?.();
            } else if (mode === "add") {
                await axios.post("/api/calories/exercise", {
                    userId,
                    customName: name,
                    exercise: exerciseName,
                    intensity,
                    metValue,
                    duration,
                });
                onAdd?.();
            }
        } catch {
            showAlert("Failed to save exercise.", "error");
        }
    };

    const handleDelete = async () => {
        if (!exercise) return;
        const confirmed = window.confirm("Are you sure you want to delete this exercise?");
        if (!confirmed) return;

        try {
            await axios.delete(`/api/calories/${userId}/${exercise.id}`);
            onDelete?.();
        } catch {
            showAlert("Failed to delete exercise.", "error");
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-1">
                    <Label className="required-label pt-3">Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>

                    {mode === "edit" && (
                        <div>
                            <Label className="text-muted-foreground">Calories Burned</Label>
                            <div>{exercise?.calories ?? 0} cal</div>
                        </div>
                    )}

                    <Label className="required-label pt-3">Exercise</Label>
                    <CustomCombobox
                        options={exerciseList}
                        value={exerciseName}
                        onChange={handlePresetSelect}
                        placeholder="Choose an exercise"
                    />

                    <Label className="required-label pt-3">Intensity</Label>
                    <CustomCombobox
                        options={intensityList}
                        value={intensity}
                        onChange={handleIntensitySelect}
                        placeholder="Choose intensity"
                    />

                    <Label className="required-label pt-3">Met Value</Label>
                    <Input
                        type="number"
                        value={metValue}
                        onChange={(e) => setMetValue(parseFloat(e.target.value ? e.target.value : "0"))}
                    />

                    <Label className="required-label pt-3">Duration (minutes)</Label>
                    <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseFloat(e.target.value ? e.target.value : "0"))}
                    />
                </div>

                <DialogFooter className="mt-4">
                    {mode === "edit" && (
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
