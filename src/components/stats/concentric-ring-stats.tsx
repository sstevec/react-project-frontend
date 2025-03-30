"use client";

import {Card, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {useAlert} from "@/components/alert/alert-provider";

const CIRCLE_CALORIES = 2000;

interface SummaryData {
    intake: number;
    exercise: number;
    net: number;
}

export default function ConcentricRingStats() {
    const [data, setData] = useState<SummaryData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const {showAlert} = useAlert();
    const [hoverInfo, setHoverInfo] = useState<{ label: string; value: number } | null>(null);
    const [animatedValues, setAnimatedValues] = useState<SummaryData>({
        intake: 0,
        exercise: 0,
        net: 0
    });

    const fetchData = () => {
        const uid = sessionStorage.getItem("gym-sync-id");
        if (!uid) return;
        setUserId(uid);

        // Reset values for animation
        setAnimatedValues({intake: 0, exercise: 0, net: 0});

        const today = new Date().toISOString().split("T")[0];

        axios
            .get(`/api/calories/summary/${uid}/date/${today}`)
            .then(({data}) => {
                setData(data);
                // Animate to actual values after data loads
                setAnimatedValues({
                    intake: data.intake,
                    exercise: data.exercise,
                    net: Math.abs(data.net)
                });
            })
            .catch((res) => {
                showAlert("Failed to load summary data", "error")
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getCircumference = (radius: number) => 2 * Math.PI * radius;

    const getStrokeLength = (value: number, radius: number) => {
        const circumference = getCircumference(radius);
        const adjustedValue = Math.min(value, CIRCLE_CALORIES);
        const extraValue = Math.max(0, value - CIRCLE_CALORIES);
        const baseStroke = Math.max((adjustedValue / CIRCLE_CALORIES) * circumference, 0.01 * circumference);
        const overflowStroke = (extraValue / CIRCLE_CALORIES) * circumference;
        return {
            baseStroke,
            overflowStroke,
            circumference,
        };
    };

    const getColor = (label: string, isOverflow = false) => {
        switch (label) {
            case "Intake":
                return isOverflow ? "var(--highlight-dark)" : "var(--highlight-light)";
            case "Exercise":
                return isOverflow ? "var(--primary)" : "var(--primary-light)";
            case "Net":
                if (isOverflow) {
                    return data!.net >= 0 ? "var(--error)" : "var(--third)";
                }
                return data!.net >= 0 ? "var(--error-light)" : "var(--third-light)";
            default:
                return "#ccc";
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <Card className="w-full h-full flex flex-col p-0 card-primary">
            <CardContent className="w-full h-full p-0">
                <div className="relative w-full h-full flex items-center justify-center">
                    <svg width="300" height="300" viewBox="0 0 300 300">
                        {[
                            {label: "Intake", value: animatedValues.intake, radius: 130},
                            {label: "Exercise", value: animatedValues.exercise, radius: 100},
                            {label: "Net", value: animatedValues.net, radius: 70}
                        ].map((item) => {
                            const {
                                baseStroke,
                                overflowStroke,
                                circumference
                            } = getStrokeLength(item.value, item.radius);
                            const strokeDasharray = `${baseStroke} ${circumference}`;
                            const overflowDasharray = `${overflowStroke} ${circumference}`;
                            const isNetNegative = item.label === "Net" && data.net < 0;
                            const strokeDashoffset = isNetNegative ? -(circumference - baseStroke) : 0;

                            return (
                                <g key={item.label}>
                                    {/* Base Stroke */}
                                    <circle
                                        cx="150"
                                        cy="150"
                                        r={item.radius}
                                        fill="none"
                                        stroke={getColor(item.label)}
                                        strokeWidth="28"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        transform="rotate(-90 150 150)"
                                        style={{
                                            transition: "stroke-dasharray 0.8s ease-out, stroke-dashoffset 0.8s ease-out"
                                        }}
                                        onMouseEnter={() => setHoverInfo(item)}
                                        onMouseLeave={() => setHoverInfo(null)}
                                    />

                                    {/* Overflow Stroke */}
                                    {item.value > CIRCLE_CALORIES && (
                                        <circle
                                            cx="150"
                                            cy="150"
                                            r={item.radius}
                                            fill="none"
                                            stroke={getColor(item.label, true)}
                                            strokeWidth="28"
                                            strokeDasharray={overflowDasharray}
                                            strokeDashoffset={isNetNegative ? -(circumference - overflowStroke) : 0}
                                            transform="rotate(-90 150 150)"
                                            style={{
                                                transition: "stroke-dasharray 0.8s ease-out, stroke-dashoffset 0.8s ease-out",
                                                opacity: 0.5
                                            }}
                                            onMouseEnter={() => setHoverInfo(item)}
                                            onMouseLeave={() => setHoverInfo(null)}
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Rest of the component remains the same */}
                    <button
                        className="absolute w-16 h-16 rounded-full bg-blue-500 text-white text-sm shadow-lg"
                        onClick={fetchData}
                    >
                        Compute
                    </button>

                    {hoverInfo && (
                        <div className="absolute bg-white shadow-lg p-2 rounded-lg text-sm">
                            {hoverInfo.label}: {hoverInfo.value} cal
                        </div>
                    )}

                    <div className="absolute bottom-0 w-full flex justify-around p-4">
                        <div>Intake: {data.intake} cal</div>
                        <div>Exercise: {data.exercise} cal</div>
                        <div>Net: {data.net} cal</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}