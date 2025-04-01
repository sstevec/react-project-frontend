"use client";

import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Card} from "@/components/ui/card";
import {useAlert} from "@/components/alert/alert-provider";

export default function WaterTracker() {
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [trackerId, setTrackerId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const {showAlert} = useAlert();

    useEffect(() => {
        const uid = sessionStorage.getItem("gym-sync-id");
        if (!uid) return;
        setUserId(uid);

        const today = new Date().toISOString().split("T")[0];

        axios.get("/api/tracker/byName", {params: {name: "water", type: "system", userId: uid, date: today}})
            .then(({data}) => {
                setTrackerId(data.id);
                setCurrentValue(data.detail?.value || 0);
            })
            .catch(() => showAlert("Failed to load water tracker data", "error"));
    }, []);

    const incrementWater = () => {
        if (!userId || !trackerId) return;

        const newValue = currentValue + 1;
        setCurrentValue(newValue);

        axios
            .put(`/api/tracker/change/${userId}/${trackerId}`, {
                detail: {value: newValue},
            })
            .then(() => showAlert("Water intake updated!", "success"))
            .catch(() => showAlert("Failed to update water intake", "error"));
    };

    return (
        <Card className="w-full h-full p-2 flex flex-col items-center justify-center gap-0 card-dark">
            {/* Title */}
            <h1 className="text-xl font-semibold mb-1">Water</h1>

            {/* SVG Placeholder */}
            <div className="w-auto h-30 rounded-full mb-1 flex items-center justify-center overflow-hidden"
                 onClick={incrementWater}>
                <img
                    src={"/water.png"}
                    alt="Loading"
                    className="h-full w-auto object-cover"
                />
            </div>


            {/* Watering Reminder */}
            <p className="text-md p-0">I need to be watered 8 times!</p>
            <p className="text-md">So far {currentValue}/8</p>
        </Card>
    );
}
