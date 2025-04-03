"use client";

import {use, useEffect, useState} from "react";
import axios from "@/lib/axios";
import {useAlert} from "@/components/alert/alert-provider";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RefreshCcw} from "lucide-react";
import {useParams} from "next/navigation";

interface PageProps {
    params: { id: string };
}

interface User {
    id: string;
    name: string;
    profilePicUrl: string | null;
}

interface Competition {
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
    objective: string;
    rankMethod: "ascending" | "descending";
    startDate: string;
    endDate: string;
    access: string;
    createdAt: string;
    creator: User;
}

interface ProgressData {
    userId: string;
    competitionId: string;
    progressData: string;
}

interface Participant {
    progressData: string;
    user: User;
}

export default function CompetitionDetailPage() {
    const params = useParams();
    const id = params.id;
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("gym-sync-id") ?? "" : "";
    const {showAlert} = useAlert();
    const [competition, setCompetition] = useState<Competition | null>(null);
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const fetchAll = async () => {
        try {
            const [compRes, progRes, partRes] = await Promise.all([
                axios.get(`/api/competitions/${id}/info`),
                axios.get(`/api/competitions/${id}/progress`),
                axios.get(`/api/competitions/${id}/participants`),
            ]);

            setCompetition(compRes.data);
            setProgress(progRes.data || null);
            setParticipants(partRes.data || []);
        } catch {
            showAlert("Failed to load competition details", "error");
        }
    };

    useEffect(() => {
        fetchAll();
    }, [id]);

    const handleJoin = async () => {
        try {
            await axios.post(`/api/competitions/${id}/join`);
            showAlert("Successfully joined the competition!", "success");
            fetchAll();
        } catch (err: any) {
            showAlert(err?.response?.data?.message || "Join failed", "error");
        }
    };

    const recompute = async () => {
        try {
            if (!competition) return;

            await axios.post(`/api/competitions/compute-rank/${competition.id}`);
            showAlert("Successfully compute competition ranks!", "success");
            fetchAll()
        } catch (err: any) {
            showAlert(err?.response?.data?.message || "Compute Rank Fail", "error");
        }
    }

    if (!competition) return null;

    const isCreator = competition.creator.id === userId;
    const isActive = new Date() >= new Date(competition.startDate) && new Date() <= new Date(competition.endDate);

    return (
        <div className="w-[70%] max-w-[1500px] min-w-[1000px] mx-auto py-6 mt-0">
            <Card className="overflow-hidden pt-0">
                {/* Top Image */}
                {competition.imageUrl ? (
                    <img src={competition.imageUrl} alt="Competition" className="w-full h-[350px] object-cover"/>
                ) : (
                    <div className="w-full h-[350px] bg-gray-200"/>
                )}

                <CardContent className="p-6 space-y-4">
                    {/* Title + Creator */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{competition.title}</h1>
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={competition.creator.profilePicUrl || "/globe.svg"}/>
                                <AvatarFallback>{competition.creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{competition.creator.name}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="text-sm whitespace-pre-line text-muted-foreground">{competition.description}</div>

                    {/* Rank Method */}
                    <div className="text-sm font-medium">Ranking Method: {competition.rankMethod}</div>

                    {/* Join / Progress */}
                    {!progress ? (
                        <Button onClick={handleJoin}>Join Competition</Button>
                    ) : (
                        <div className="text-sm space-y-1">
                            <div><span className="font-medium">Objective:</span> {competition.objective}</div>
                            <div><span className="font-medium">Your Progress:</span> {progress.progressData || 0}</div>
                        </div>
                    )}

                    {/* Leaderboard */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">Leaderboard</h2>
                            {isCreator && (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={recompute}
                                    disabled={!isActive}
                                    title={!isActive ? "Competition is not active" : "Refresh leaderboard"}
                                >
                                    <RefreshCcw className="w-4 h-4"/>
                                </Button>
                            )}
                        </div>

                        {participants.length === 0 ? (
                            <div className="text-sm text-muted-foreground italic">No participants yet. Be the first to
                                join and climb the leaderboard!</div>
                        ) : (
                            <div className="rounded-md overflow-hidden border">
                                <div className="flex items-center font-semibold text-sm bg-gray-200 px-4 py-2">
                                    <div className="w-[150px]">Rank</div>
                                    <div className="flex-1">Participant</div>
                                    <div className="w-28 text-left">Progress</div>
                                </div>
                                {participants.map((p, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center text-sm px-4 py-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                    >
                                        <div className="w-[150px]">#{index + 1}</div>
                                        <div className="flex items-center gap-2 flex-1">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={p.user.profilePicUrl || "/globe.svg"}/>
                                                <AvatarFallback>{p.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{p.user.name}</span>
                                        </div>
                                        <div className="w-28  text-muted-foreground">{p.progressData || 0}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}