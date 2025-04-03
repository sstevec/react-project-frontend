"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { parseISO, getDay, getMonth, startOfMonth, endOfMonth, subMonths, addMonths, format } from "date-fns";
import { useAlert } from "@/components/alert/alert-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FrequencyEntry {
    date: string;
    count: number;
}

interface FrequencyMap {
    [date: string]: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function FrequencyGrid() {
    const [frequency, setFrequency] = useState<FrequencyMap>({});
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("gym-sync-id") ?? "" : "";
    const { showAlert } = useAlert();

    useEffect(() => {
        if (!userId) return;
        const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
        const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

        axios.get(`/api/calories/frequency/${userId}`, {
            params: { start, end },
        })
            .then(res => {
                const entries: FrequencyEntry[] = res.data.data || [];
                const mapped: FrequencyMap = {};
                for (const entry of entries) {
                    mapped[entry.date] = entry.count;
                }
                setFrequency(mapped);
            })
            .catch(() => showAlert("Failed to load frequency data", "error"));
    }, [userId, currentMonth]);

    const daysInMonth = Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }, (_, i) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
        return format(date, "yyyy-MM-dd");
    });

    const getColor = (count: number) => {
        if (count === 0) return "bg-gray-100";
        if (count < 2) return "bg-green-100";
        if (count < 4) return "bg-green-300";
        return "bg-green-500";
    };

    return (
        <Card className="w-[350px] min-h-[350px] p-4">
            <div className="flex justify-between items-center mb-4">
                <Button size="icon" variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-lg font-semibold">
                    {format(currentMonth, "MMMM yyyy")}
                </div>
                <Button size="icon" variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground">
                {WEEKDAYS.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mt-1 justify-items-center">
                {(() => {
                    const firstDayOfMonth = getDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
                    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="w-8 h-8" />);
                    return [
                        ...blanks,
                        ...daysInMonth.map(dateStr => {
                            const dayNum = parseISO(dateStr).getDate();
                            return (
                                <div
                                    key={dateStr}
                                    title={dateStr}
                                    className="w-8 h-8 rounded-sm flex flex-col items-center justify-start text-[10px] text-muted-foreground"
                                >
                                    <div>{dayNum}</div>
                                    <div className={`w-4 h-4 mt-0.5 rounded-sm ${getColor(frequency[dateStr] || 0)}`}></div>
                                </div>
                            );
                        })
                    ];
                })()}
            </div>
        </Card>
    );
}
