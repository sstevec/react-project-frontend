"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Competition } from "./competition-type";
import CompetitionDisplayCard from "./competition-display-card";
import { Button } from "@/components/ui/button";

interface CompetitionPagedProps {
    userId: string;
    type: "joined" | "held";
}

export default function CompetitionPaged({ userId, type }: CompetitionPagedProps) {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const url =
            type === "joined"
                ? `/api/competitions/history/${userId}`
                : `/api/competitions/user/created`;

        axios
            .get(url, { params: { page } })
            .then(({ data }) => {
                if (Array.isArray(data)) {
                    setCompetitions(data);
                    setHasMore(data.length === 10);
                } else {
                    setCompetitions([]);
                    setHasMore(false);
                }
            })
            .catch(() => console.error("Failed to load competitions"));
    }, [userId, page, type]);

    if (competitions.length === 0) return <div className="text-muted-foreground text-sm italic">Nothing Found Here</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {competitions.map((comp) => (
                    <CompetitionDisplayCard key={comp.id} competition={comp} onClick={() => window.location.href = `/competition/${comp.id}`} />
                ))}
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                </Button>
                <div className="text-sm px-2 py-1">Page {page}</div>
                <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}