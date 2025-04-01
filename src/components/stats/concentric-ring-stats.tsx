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
    base: number;
}
interface ConcentricRingStatsProps {
    userId: string | null;
    editable: boolean;
}

export default function ConcentricRingStats({ userId, editable }: ConcentricRingStatsProps) {
    const [data, setData] = useState<SummaryData | null>(null);
    const {showAlert} = useAlert();
    const [hoverInfo, setHoverInfo] = useState<{ label: string; value: number } | null>(null);
    const [animatedValues, setAnimatedValues] = useState<SummaryData>({
        intake: 0,
        exercise: 0,
        net: 0,
        base: 0,
    });

    const fetchData = () => {
        if (!userId) return;

        // Reset values for animation
        setAnimatedValues({intake: 0, exercise: 0, net: 0, base: 0});

        const today = new Date().toISOString().split("T")[0];

        axios
            .get(`/api/calories/summary/${userId}/date/${today}`)
            .then(({data}) => {
                setData(data);
                // Animate to actual values after data loads
                setAnimatedValues({
                    intake: data.intake,
                    exercise: data.exercise,
                    net: Math.abs(data.net),
                    base: data.base
                });
            })
            .catch(() => {
                showAlert("Failed to load summary data", "error")
            });
    };

    useEffect(() => {
        fetchData();
    }, [userId]);


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
                return isOverflow ? "var(--food-overflow)" : "var(--food)";
            case "Exercise":
                return isOverflow ? "var(--exercise-overflow)" : "var(--exercise)";
            case "Net":
                if (isOverflow) {
                    return data!.net >= 0 ? "var(--net-pos-overflow)" : "var(--net-neg-overflow)";
                }
                return data!.net >= 0 ? "var(--net-pos)" : "var(--net-neg)";
            default:
                return "#ccc";
        }
    };

    if (!data) return <div></div>;

    return (
        <div className="relative w-full h-full">
            <svg width="600" height="300" viewBox="0 0 300 300" className="absolute top-0 w-full">
                {[
                    // 1. Reordered rings: Intake (outer), Net (middle), Exercise (inner)
                    {label: "Intake", value: animatedValues.intake, radius: 130},
                    {label: "Net", value: animatedValues.net, radius: 100},
                    {label: "Exercise", value: animatedValues.exercise, radius: 70}
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
                             2. Add background ring with 10% opacity
                            <circle
                                cx="150"
                                cy="150"
                                r={item.radius}
                                fill="none"
                                stroke={getColor(item.label)}
                                strokeOpacity="0.3"
                                strokeWidth="30"
                                strokeDasharray={`${circumference} ${circumference}`}
                                transform="rotate(-90 150 150)"
                            />

                            {/* Base Stroke */}
                            <circle
                                cx="150"
                                cy="150"
                                r={item.radius}
                                fill="none"
                                stroke={getColor(item.label)}
                                strokeWidth="30"
                                strokeOpacity="1"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
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
                                    strokeWidth="30"
                                    strokeOpacity="1"
                                    strokeDasharray={overflowDasharray}
                                    strokeDashoffset={isNetNegative ? -(circumference - overflowStroke) : 0}
                                    strokeLinecap="round"
                                    transform="rotate(-90 150 150)"
                                    style={{
                                        transition: "stroke-dasharray 0.8s ease-out, stroke-dashoffset 0.8s ease-out",
                                    }}
                                    onMouseEnter={() => setHoverInfo(item)}
                                    onMouseLeave={() => setHoverInfo(null)}
                                />
                            )}
                        </g>
                    );
                })}
                <defs>
                    <marker
                        id="hollow-dot"
                        markerWidth="20"
                        markerHeight="20"
                        refX="10"
                        refY="10"
                        orient="auto"
                    >
                        <circle
                            cx="10"
                            cy="10"
                            r="2"
                            fill="none"
                            stroke="var(--primary-dark)"
                            strokeWidth="1"
                        />
                    </marker>
                </defs>

                <line
                    x1="-47" y1="165"
                    x2="80" y2="165"
                    stroke="var(--primary-dark)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    markerEnd="url(#hollow-dot)"
                    markerStart="url(#hollow-dot)"
                />
                <line
                    x1="337" y1="35"
                    x2="240" y2="60"
                    stroke="var(--primary-dark)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    markerEnd="url(#hollow-dot)"
                    markerStart="url(#hollow-dot)"
                />
                <line
                    x1="337" y1="265"
                    x2="220" y2="225"
                    stroke="var(--primary-dark)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    markerEnd="url(#hollow-dot)"
                    markerStart="url(#hollow-dot)"
                />

                <foreignObject x="-150" y="130" width="100" height="70">
                    <Card className="h-full p-0 card-dark justify-center">
                        <CardContent className="p-0 text-center">
                            <div className="text-md text-muted-foreground">Exercise</div>
                            <div className="font-bold">{data.exercise} cal</div>
                        </CardContent>
                    </Card>
                </foreignObject>

                {/* Intake Card (top right) */}
                <foreignObject x="340" y="0" width="100" height="70">
                    <Card className="h-full p-0 card-dark justify-center">
                        <CardContent className="p-0 text-center">
                            <div className="text-md text-muted-foreground">Food</div>
                            <div className="font-bold">{data.intake} cal</div>
                        </CardContent>
                    </Card>
                </foreignObject>

                {/* Net Card (bottom right) */}
                <foreignObject x="340" y="230" width="100" height="70">
                    <Card className="h-full p-0 card-dark justify-center">
                        <CardContent className="p-0 text-center">
                            <div className="text-md text-muted-foreground">Remaining</div>
                            <div className="font-bold">{data.net} cal</div>
                        </CardContent>
                    </Card>
                </foreignObject>
            </svg>

            {/* Rest of the component remains the same */}
            <button
                className="absolute w-20 h-20 rounded-full bg-transparent"
                onClick={fetchData}
                disabled={!editable}
            >
            </button>

            {hoverInfo && (
                <div className="absolute bg-white shadow-lg p-2 rounded-lg text-sm">
                    {hoverInfo.label}: {hoverInfo.value} cal
                </div>
            )}

            <div className="absolute bottom-0 w-full h-10 flex justify-center items-center">
                <div>
                    Base ({data.base}Cal) - Food + Exercise = Remaining
                </div>
            </div>
        </div>
    );
}