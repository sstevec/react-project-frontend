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

export default function NutritionTable() {
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
    }, []);

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

    return (
        <Card className="w-full h-full p-4 overflow-hidden">
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
                        {filteredData.slice(0, calculateRows(document.getElementById('nutrition-container')?.offsetHeight || 0) * calculateColumns(document.getElementById('nutrition-container')?.offsetWidth || 0)).map((item, index) => {
                            const max = item.recommendedAmount ?? item.amount;
                            const percentage = item.percentageSatisfied ?? 100;

                            return (
                                <div key={index} className="p-2 h-[60px] w-[310px]">
                                    <div className="flex justify-between mb-1">
                                        <span>{item.name}</span>
                                        <span>{item.amount}/{max}</span>
                                    </div>
                                    <div className="relative w-full h-4 bg-gray-200 rounded-full">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: percentage >= 100 ? 'var(--error)' : 'var(--primary)',
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
