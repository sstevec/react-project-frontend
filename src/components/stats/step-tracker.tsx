"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { useAlert } from "@/components/alert/alert-provider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepTrackerProps {
    userId: string | null;
    editable: boolean;
}

export default function StepTracker({ userId, editable }: StepTrackerProps) {
    const [steps, setSteps] = useState<number>(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [trackerId, setTrackerId] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newSteps, setNewSteps] = useState<number>(0);
    const [newDistance, setNewDistance] = useState<number>(0);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (!userId) return;

        const today = new Date().toISOString().split("T")[0];

        axios
            .get("/api/tracker/byName", {
                params: {
                    name: "step",
                    type: "system",
                    userId,
                    date: today,
                },
            })
            .then(({ data }) => {
                setSteps(data.detail?.value || 0);
                setDistance(data.detail?.distance ?? null);
                setNewSteps(data.detail?.value || 0);
                setNewDistance(data.detail?.distance ?? 0);
                setTrackerId(data.id || null);
            })
            .catch(() => showAlert("Failed to load step tracker data", "error"));
    }, [userId]);

    const formatNumber = (num: number) => num.toLocaleString();

    const handleSave = async () => {
        if (newSteps < 0 || newDistance < 0) {
            showAlert("Steps and distance must be non-negative numbers.", "error");
            return;
        }

        if (!userId || !trackerId) return;

        try {
            await axios.put(`/api/tracker/change/${userId}/${trackerId}`, {
                detail: {
                    value: newSteps,
                    distance: newDistance,
                },
            });
            setSteps(newSteps);
            setDistance(newDistance);
            setShowDialog(false);
            showAlert("Step tracker updated!", "success");
        } catch {
            showAlert("Failed to update step tracker", "error");
        }
    };


    if (!userId) return <div></div>;

    return (
        <>
            <Card className="w-full h-full p-2 flex flex-col items-center justify-center gap-0 card-dark">
                <h1 className="text-xl font-semibold">Steps</h1>
                {/*<div >*/}
                {/*    <img src="/steps-font.png" alt="Icon" className="h-auto w-40 object-contain"/>*/}
                {/*</div>*/}
                <div
                    className="w-36 h-32 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => editable && setShowDialog(true)}
                >
                    <img src="/steps.png" alt="Steps" className="h-full w-32"/>
                </div>

                <p className="text-md">Current steps: {formatNumber(steps)}</p>
                <p className="text-md">Distance: {distance !== null ? `${distance.toFixed(2)} km` : "0"}</p>
            </Card>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Step Tracker</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Steps</label>
                            <Input
                                type="number"
                                min={0}
                                value={newSteps}
                                onChange={(e) => setNewSteps(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Distance (km)</label>
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={newDistance}
                                onChange={(e) => setNewDistance(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="secondary" onClick={() => setShowDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
