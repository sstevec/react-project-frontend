"use client";

import {useState} from "react";
import {Competition} from "./competition-type";
import CompetitionDisplayCard from "./competition-display-card";
import {Button} from "@/components/ui/button";

interface CompetitionDisplayListProps {
    competitions: Competition[];
}

export default function CompetitionScrollHorizontal({competitions}: CompetitionDisplayListProps) {
    if (competitions.length === 0) {
        return (
            <div className="text-muted-foreground text-sm italic">
                No competitions found in this category.
            </div>
        );
    }

    return (
        <div className="space-y-4 min-h-[290px]">
            <div className="flex flex-wrap gap-4">
                {competitions.map((comp) => (
                    <CompetitionDisplayCard
                        key={comp.id}
                        competition={comp}
                        onClick={() => window.location.href = `/competition/${comp.id}`}
                    />
                ))}
            </div>
        </div>
    );
}