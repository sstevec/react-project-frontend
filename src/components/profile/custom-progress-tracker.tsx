"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { useAlert } from "@/components/alert/alert-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const TRACKERS = ["BMI", "Muscle Mass", "Weight"];

export function TrackerProgress() {
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("gym-sync-id") ?? "" : "";
    const { showAlert } = useAlert();

    const [goals, setGoals] = useState<Record<string, number>>({});
    const [values, setValues] = useState<Record<string, number>>({});

    const [showEntryDialog, setShowEntryDialog] = useState(false);
    const [selectedTracker, setSelectedTracker] = useState<string | null>(null);
    const [newValue, setNewValue] = useState("");
    const [entryDate, setEntryDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [showGoalDialog, setShowGoalDialog] = useState(false);
    const [editingGoalTracker, setEditingGoalTracker] = useState<string | null>(null);
    const [newGoalValue, setNewGoalValue] = useState("");

    useEffect(() => {
        if (!userId) return;
        fetchUserGoals();
        fetchLatestTrackerValues();
    }, [userId]);

    const fetchUserGoals = async () => {
        try {
            const { data } = await axios.get("/api/users/info");
            const detail = JSON.parse(data.detail || "{}");
            const goalsData: Record<string, number> = {};
            TRACKERS.forEach((key) => {
                const goal = detail["custom-trackers"]?.[key];
                if (goal) goalsData[key] = parseFloat(goal);
            });
            setGoals(goalsData);
            setValues((prev) => ({ ...prev, Weight: parseFloat(data.weight) }));
        } catch {
            showAlert("Failed to load goals", "error");
        }
    };

    const fetchLatestTrackerValues = async () => {
        for (const name of TRACKERS) {
            try {
                const { data } = await axios.get("/api/tracker/latest", {
                    params: { userId, name, type: "custom" },
                });
                setValues((prev) => ({
                    ...prev,
                    [name]: data?.detail?.value || (name === "Weight" ? prev.Weight : 0),
                }));
            } catch {
                showAlert(`Failed to load value for ${name}`, "error");
            }
        }
    };

    const addTrackerEntry = async () => {
        if (!selectedTracker || !newValue.trim() || !entryDate) return;
        try {
            await axios.post("/api/tracker/add", {
                name: selectedTracker,
                type: "custom",
                userId,
                date: entryDate,
                detail: { value: parseFloat(newValue) },
            });
            showAlert("Entry added successfully", "success");
            setShowEntryDialog(false);
            setNewValue("");
            setSelectedTracker(null);
            fetchLatestTrackerValues();
        } catch {
            showAlert("Failed to add entry", "error");
        }
    };

    const updateTrackerGoal = async () => {
        if (!editingGoalTracker || !newGoalValue.trim()) return;
        try {
            const { data } = await axios.get("/api/users/info");
            const detail = JSON.parse(data.detail || "{}");
            const trackers = detail["custom-trackers"] || {};
            trackers[editingGoalTracker] = newGoalValue;
            detail["custom-trackers"] = trackers;
            await axios.post("/api/users/modify", { detail: JSON.stringify(detail) });
            showAlert("Goal updated", "success");
            setGoals((prev) => ({
                ...prev,
                [editingGoalTracker]: parseFloat(newGoalValue),
            }));
            setShowGoalDialog(false);
        } catch {
            showAlert("Failed to update goal", "error");
        }
    };

    return (
        <Card className="w-full h-full p-4 space-y-4 justify-center card-lighter">
            {TRACKERS.map((name) => {
                const current = values[name] || 0;
                const max = goals[name] || current;
                const percent = Math.min((current / max) * 100, 100);

                return (
                    <div key={name}>
                        <div className="flex justify-between text-sm mb-1 items-center">
                          <span
                              className="cursor-pointer hover:underline"
                              onClick={() => {
                                  setEditingGoalTracker(name);
                                  setNewGoalValue(goals[name]?.toString() || "");
                                  setShowGoalDialog(true);
                              }}
                          >
                            {name}: {current} / {max}
                          </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="relative cursor-pointer hover:bg-white p-2"
                                onClick={() => {
                                    setSelectedTracker(name);
                                    setShowEntryDialog(true);
                                }}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <Progress value={percent} className="h-5" />
                    </div>
                );
            })}

            {/* Entry Dialog */}
            <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add Tracker Entry</DialogTitle></DialogHeader>
                    <Label>Tracker: {selectedTracker}</Label>
                    <Input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <Label className="mt-2">Date</Label>
                    <Input
                        type="date"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                    />
                    <Button onClick={addTrackerEntry} className="mt-4 w-full">Submit</Button>
                </DialogContent>
            </Dialog>

            {/* Goal Dialog */}
            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit Tracker Goal</DialogTitle></DialogHeader>
                    <Label>Tracker: {editingGoalTracker}</Label>
                    <Input
                        type="number"
                        value={newGoalValue}
                        onChange={(e) => setNewGoalValue(e.target.value)}
                    />
                    <Button onClick={updateTrackerGoal} className="mt-4 w-full">Save Goal</Button>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
