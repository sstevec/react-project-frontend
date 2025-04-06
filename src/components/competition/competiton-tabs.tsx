"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Competition } from "./competition-type";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/alert/alert-provider";
import CompetitionScrollHorizontal from "@/components/competition/competition-scroll-horizontal";

interface CompetitionTabsProps {
    userId: string;
}

export default function CompetitionTabs({ userId }: CompetitionTabsProps) {
    const [tab, setTab] = useState<"hosting" | "active" | "recommended">("hosting");
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const { showAlert } = useAlert();

    const fetchHosting = async () => {
        try {
            const { data } = await axios.get(`/api/competitions/user/created/upcoming/${userId}`);
            setCompetitions(data);
        } catch {
            showAlert("Failed to load hosting competitions", "error");
        }
    };

    const fetchActive = async () => {
        try {
            const { data } = await axios.get(`/api/competitions/active/${userId}`);
            const extracted = data.map((item: any) => item.competition);
            setCompetitions(extracted);
        } catch {
            showAlert("Failed to load active competitions", "error");
        }
    };

    const fetchRecommended = async () => {
        try {
            const { data } = await axios.get(`/api/competitions/suggest/${userId}`);
            setCompetitions(data);
        } catch {
            showAlert("Failed to load recommended competitions", "error");
        }
    };

    useEffect(() => {
        if (tab === "hosting") fetchHosting();
        else if (tab === "active") fetchActive();
        else if (tab === "recommended") fetchRecommended();
    }, [tab]);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button
                    variant={tab === "hosting" ? "default" : "outline"}
                    onClick={() => setTab("hosting")}
                >
                    Hosting
                </Button>
                <Button
                    variant={tab === "active" ? "default" : "outline"}
                    onClick={() => setTab("active")}
                >
                    Active
                </Button>
                <Button
                    variant={tab === "recommended" ? "default" : "outline"}
                    onClick={() => setTab("recommended")}
                >
                    Recommended
                </Button>
            </div>

            <CompetitionScrollHorizontal competitions={competitions} />
        </div>
    );
}