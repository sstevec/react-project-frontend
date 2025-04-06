"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { useAlert } from "@/components/alert/alert-provider";
import { addDays, format, subDays } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const TRACKERS = ["BMI", "Muscle Mass", "Weight"];

const COLOR_MAP: Record<string, string> = {
    "BMI": "var(--primary)",
    "Muscle Mass": "var(--highlight)",
    "Weight": "var(--error)",
};

interface TrackerEntry {
    id: string;
    createdAt: string;
    detail: { value: number };
}

export function TrackerGraph() {
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("gym-sync-id") ?? "" : "";
    const { showAlert } = useAlert();
    const [entries, setEntries] = useState<Record<string, TrackerEntry[]>>({});

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
            const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
            const result: Record<string, TrackerEntry[]> = {};

            for (const name of TRACKERS) {
                try {
                    const { data } = await axios.get("/api/tracker/byRange", {
                        params: { userId, name, type: "custom", startDate, endDate },
                    });
                    result[name] = data || [];
                } catch {
                    showAlert(`Failed to load tracker: ${name}`, "error");
                }
            }
            setEntries(result);
        };

        fetchData();
    }, [userId]);

    // Merge the tracker entries into a unified date-based data array
    const mergedData: any[] = [];
    const dateSet = new Set<string>();
    TRACKERS.forEach(name => {
        entries[name]?.forEach(entry => {
            const dateStr = entry.createdAt.split("T")[0]; // match precise day
            dateSet.add(dateStr);
        });
    });
    const dates = Array.from(dateSet).sort();

    for (const date of dates) {
        const row: any = { date: date.slice(5) };
        for (const name of TRACKERS) {
            const point = entries[name]?.find(e => e.createdAt.split("T")[0] === date);
            if (point) row[name] = point.detail.value;
        }
        mergedData.push(row);
    }

    return (
        <Card className="w-full h-full pt-4 pb-0 pl-0 pr-4 m-0 card-inline">
            <div className="h-full w-full p-0 m-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mergedData}>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        {TRACKERS.map(name => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={COLOR_MAP[name]}
                                strokeWidth={2}
                                dot={{ r: 2 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
