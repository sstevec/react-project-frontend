"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { useAlert } from "@/components/alert/alert-provider";

interface StepTrackerProps {
    userId: string | null;
    editable: boolean;
}

export default function StepTracker({ userId, editable }: StepTrackerProps) {
    const [steps, setSteps] = useState<number>(0);
    const [distance, setDistance] = useState<number | null>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (!userId) return;

        const today = new Date().toISOString().split("T")[0];

        axios
            .get("/api/tracker/byName", {
                params: {
                    name: "step",
                    type: "system",
                    userId: userId,
                    date: today,
                },
            })
            .then(({ data }) => {
                setSteps(data.detail?.value || 0);
                setDistance(data.detail?.distance ?? null);
            })
            .catch(() => showAlert("Failed to load step tracker data", "error"));
    }, [userId]);

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    if (!userId) return <div></div>

    return (
        <Card className="w-full h-full p-2 flex flex-col items-center justify-center gap-0 card-dark">
            {/* Title */}
            <h1 className="text-xl font-semibold">Steps</h1>

            {/* SVG Placeholder */}
            <div className="w-36 h-32 rounded-full flex items-center justify-center overflow-hidden">
                <img
                    src={"/steps.png"}
                    alt="Loading"
                    className="h-full w-32"
                />
            </div>

            {/* Step Count */}
            <p className="text-md">Current steps: {formatNumber(steps)}</p>

            {/* Distance */}
            <p className="text-md">Distance: {distance !== null ? `${distance.toFixed(2)} km` : "0"}</p>
        </Card>
    );
}
