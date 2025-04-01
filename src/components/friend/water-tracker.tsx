"use client";

import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Card} from "@/components/ui/card";
import {useAlert} from "@/components/alert/alert-provider";

interface WaterTrackerProps {
    userId: string | null;
    editable: boolean;
}

export default function WaterTrackerViewOnly({ userId, editable }: WaterTrackerProps) {
    const [currentValue, setCurrentValue] = useState<number>(0);
    const {showAlert} = useAlert();

    useEffect(() => {
        if (!userId) return;

        const today = new Date().toISOString().split("T")[0];

        axios.get("/api/tracker/byName", {params: {name: "water", type: "system", userId: userId, date: today}})
            .then(({data}) => {
                setCurrentValue(data.detail?.value || 0);
            })
            .catch(() => showAlert("Failed to load water tracker data", "error"));
    }, [userId]);

    if (!userId) return <div></div>

    return (
        <Card className="w-full h-full p-2 flex flex-col items-center justify-center gap-0 card-dark">
            {/* Title */}
            <h1 className="text-xl font-semibold mb-1">Water</h1>

            {/* SVG Placeholder */}
            <div className="w-auto h-30 rounded-full mb-1 flex items-center justify-center overflow-hidden">
                <img
                    src={"/water.png"}
                    alt="Loading"
                    className="h-full w-auto object-cover"
                />
            </div>
            <p className="text-md">So far {currentValue}/8</p>
        </Card>
    );
}
