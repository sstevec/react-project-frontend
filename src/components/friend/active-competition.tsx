"use client";

import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Card} from "@/components/ui/card";
import {format} from "date-fns";
import {useAlert} from "@/components/alert/alert-provider";
import {useRouter} from "next/navigation";

interface ActiveCompetition {
    userId: string;
    progressData: number | null
    id: String;
    competitionId: string;
    competition: Competition;
}

interface Competition {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    startDate: string;
    endDate: string;
}

interface FriendActiveCompetitionsProps {
    friendId: string;
}

const randomColors = [
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-purple-200",
];

export default function FriendActiveCompetitions({friendId}: FriendActiveCompetitionsProps) {
    const [competitions, setCompetitions] = useState<ActiveCompetition[]>([]);
    const {showAlert} = useAlert();
    const router = useRouter();

    useEffect(() => {
        if (!friendId) return;

        axios.get(`/api/competitions/active/${friendId}`)
            .then(res => {
                setCompetitions(res.data || [])
            })
            .catch(() => showAlert("Failed to load friend's active competitions", "error"));
    }, [friendId]);

    return (
        <Card className="w-full h-full p-4 space-y-1 card-dark overflow-y-auto no-scrollbar">
            {competitions.length === 0 ? (
                <div className="text-muted-foreground italic text-sm">No active competitions for this friend.</div>
            ) : (
                competitions.map((comp, index) => (
                    <Card
                        key={comp.competitionId}
                        className="group w-full cursor-pointer hover:shadow-md p-0 card-light"
                        onClick={() => router.push(`/competition/${comp.competitionId}`)}
                    >
                        <div className="grid grid-cols-[35%_minmax(30%,300px)] gap-4 w-full h-full justify-between">
                            {/* Text Content */}
                            <div className="flex h-full flex-col justify-between py-2 px-4">
                                <div className="space-y-1">
                                    <h2 className="line-clamp-1 text-lg font-semibold">{comp.competition.title}</h2>
                                </div>
                                <div className="space-y-2 line-clamp-1 text-sm ">
                                    {comp.competition.description}
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p>
                                        Ends at {format(new Date(comp.competition.endDate), "yyyy-MM-dd")}
                                    </p>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative h-full w-full overflow-hidden p-0 right-0">
                                {comp.competition.imageUrl ? (
                                    <img
                                        src={comp.competition.imageUrl}
                                        alt="Competition"
                                        className="size-full object-cover transition-all h-30 rounded-2xl"
                                    />
                                ) : (
                                    <div
                                        className={`size-full h-30 rounded-2xl ${randomColors[index % randomColors.length]}`}
                                    />
                                )}
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </Card>
    );
}
