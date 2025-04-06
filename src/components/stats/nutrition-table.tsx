"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAlert } from "@/components/alert/alert-provider";

interface NutritionData {
    name: string;
    amount: number;
    recommendedAmount?: number;
    percentageSatisfied?: number;
}

interface NutritionDataProp {
    trigger: number
}

export default function NutritionTable({trigger} : NutritionDataProp) {
    const [data, setData] = useState<NutritionData[]>([]);
    const [filteredData, setFilteredData] = useState<NutritionData[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        const uid = sessionStorage.getItem("gym-sync-id");
        if (!uid) return;
        setUserId(uid);

        const today = new Date().toISOString().split("T")[0];

        axios
            .get(`/api/calories/nutrition-summary/${uid}/date/${today}`)
            .then(({ data }) => {
                setData(data);
                setFilteredData(data);
            })
            .catch(() => showAlert("Failed to load nutrition data", "error"));
    }, [trigger]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilteredData(
            data.filter((item) => item.name.toLowerCase().includes(searchTerm))
        );
    };

    const calculateColumns = (containerWidth: number) => {
        return Math.floor(containerWidth / 320);
    };

    const calculateRows = (containerHeight: number) => {
        return Math.floor(containerHeight / 60);
    };

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return (
        <Card className="w-full h-full p-4 overflow-hidden card-dark">
            {/* Search Bar */}
            <div className="mb-2 max-w-[440px]">
                <Input placeholder="Search nutrition..." onChange={handleSearch} />
            </div>

            {/* Responsive Process Bars */}
            <div className="w-full h-[calc(100%-56px)]" id="nutrition-container">
                {filteredData.length === 0 ? (
                    <p className="text-center text-gray-500">No nutrition data available.</p>
                ) : (
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: `repeat(${calculateColumns(document.getElementById('nutrition-container')?.offsetWidth || 0)}, 1fr)`
                        }}
                    >
                        {filteredData
                            .slice(
                                0,
                                calculateRows(document.getElementById("nutrition-container")?.offsetHeight || 0) *
                                calculateColumns(document.getElementById("nutrition-container")?.offsetWidth || 0)
                            )
                            .map((item, index) => {
                                const max = item.recommendedAmount ?? item.amount;
                                const percentage = item.percentageSatisfied ?? 100;

                                // Formatting value and units
                                const isMg = max < 1;
                                const displayAmount = isMg
                                    ? `${(item.amount * 1000).toFixed(2)} mg`
                                    : `${item.amount.toFixed(2)} g`;
                                const displayMax = isMg
                                    ? `${(max * 1000).toFixed(2)} mg`
                                    : `${max.toFixed(2)} g`;

                                // Progress bar color logic
                                let color = "var(--primary)";
                                if (percentage < 30 || percentage > 160) color = "var(--error)";
                                else if ((percentage >= 30 && percentage < 70) || (percentage > 120 && percentage <= 160))
                                    color = "var(--food)"; // yellow
                                else if (percentage >= 70 && percentage <= 120) color = "var(--net-neg)"; // green

                                return (
                                    <div key={index} className="p-2 h-[60px] w-[310px]">
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span>{capitalize(item.name)}</span>
                                            <span>{displayAmount} / {displayMax}</span>
                                        </div>
                                        <div className="relative w-full h-4 bg-gray-200 rounded-full">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min(percentage, 200)}%`,
                                                    backgroundColor: color,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </Card>
    );
}
