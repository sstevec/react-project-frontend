"use client";

import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Competition} from "./competition-type";
import CompetitionDisplayCard from "./competition-display-card";
import {Button} from "@/components/ui/button";

interface CompetitionActiveProps {
    userId: string;
}

interface ActiveCompetition {
    userId: string;
    progressData: number | null
    id: String;
    competitionId: string;
    competition: Competition;
}

export default function CompetitionActive({userId}: CompetitionActiveProps) {
    const [competitions, setCompetitions] = useState<ActiveCompetition[]>([]);
    const [unfolded, setUnfolded] = useState(false);

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`/api/competitions/active/${userId}`)
            .then(({data}) => {
                console.log(data)
                setCompetitions(data)
            })
            .catch(() => console.error("Failed to load active competitions"));
    }, [userId]);

    return (
        <div className="space-y-4 min-h-[290px]">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Active Competitions</h2>
                {competitions.length > 3 && (
                    <Button variant="ghost" size="sm" onClick={() => setUnfolded((prev) => !prev)}>
                        {unfolded ? "Collapse" : "Show All"}
                    </Button>
                )}
            </div>
            {competitions.length === 0 ? (
                <div className="text-muted-foreground text-sm italic">
                    You're not currently in any competitions. Browse and join one to get started!
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {(unfolded ? competitions : competitions.slice(0, 3)).map((comp) => (
                        <CompetitionDisplayCard key={comp.competitionId} competition={comp.competition}
                                                onClick={() => window.location.href = `/competition/${comp.competitionId}`}/>
                    ))}
                </div>
            )}
        </div>
    );
}