"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAlert } from "@/components/alert/alert-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SummaryData {
    date: string;
    intake?: number;
    exercise?: number;
    net?: number;
}

export default function LineGraph() {
    const [data, setData] = useState<SummaryData[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'year'>('week');
    const [selectedData, setSelectedData] = useState<{ intake: boolean; exercise: boolean; net: boolean }>({
        intake: true,
        exercise: true,
        net: true,
    });

    useEffect(() => {
        const uid = localStorage.getItem("gym-sync-id");
        if (!uid) return;
        setUserId(uid);
        fetchData();
    }, [userId, selectedRange]);

    const fetchData = () => {
        if (!userId) return;

        const endDate = new Date();
        let startDate = new Date();

        if (selectedRange === 'week') {
            startDate.setDate(endDate.getDate() - 7);
        } else if (selectedRange === 'month') {
            startDate.setMonth(endDate.getMonth() - 1);
        } else if (selectedRange === 'year') {
            startDate.setFullYear(endDate.getFullYear() - 1);
        }

        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];

        axios
            .get(`/api/calories/summary/${userId}/range/daily`, { params: { start, end } })
            .then(({ data }) => setData(data))
            .catch(() => showAlert("Failed to load summary data", "error"));
    };

    const handleCheckboxChange = (key: keyof typeof selectedData) => {
        setSelectedData((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Card className="w-full h-full flex flex-col card-primary ">
            <CardHeader className="flex justify-between items-center">
                {/* Range Selection */}
                <div className="space-x-2">
                    {['week', 'month', 'year'].map((range) => (
                        <Button
                            key={range}
                            size="sm"
                            variant={selectedRange === range ? "default" : "outline"}
                            onClick={() => setSelectedRange(range as 'week' | 'month' | 'year')}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </Button>
                    ))}
                </div>

                {/* Data Selection - Grouped horizontally */}
                <div className="flex space-x-4">
                    {Object.keys(selectedData).map((key) => (
                        <label key={key} className="flex items-center space-x-2">
                            <Checkbox
                                checked={selectedData[key as keyof typeof selectedData]}
                                onCheckedChange={() => handleCheckboxChange(key as keyof typeof selectedData)}
                            />
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </label>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedData.intake && <Line type="monotone" dataKey="intake" stroke="var(--highlight)" dot={selectedRange === 'year' ? false : true} />}
                        {selectedData.exercise && <Line type="monotone" dataKey="exercise" stroke="var(--primary)" dot={selectedRange === 'year' ? false : true} />}
                        {selectedData.net && <Line type="monotone" dataKey="net" stroke={data.some(d => (d.net ?? 0) >= 0) ? "var(--error)" : "var(--secondary)"} dot={selectedRange === 'year' ? false : true} />}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
