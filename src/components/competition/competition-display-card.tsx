"use client";

import {Competition} from "./competition-type";
import {format} from "date-fns";
import {Card} from "@/components/ui/card";

interface CompetitionDisplayCardProps {
    competition: Competition;
    onClick?: () => void;
    className?: string;
}

const colors = [
    "#fca5a5", // red-300
    "#fcd34d", // yellow-300
    "#86efac", // green-300
    "#93c5fd", // blue-300
    "#c4b5fd", // purple-300
];

function getRandomColor(seed: string) {
    const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

function formatDate(dateStr: string) {
    try{
        return dateStr.split("T")[0];
    } catch(e){
        console.log(e, dateStr);
    }

}

export default function CompetitionDisplayCard({
                                                   competition,
                                                   onClick,
                                                   className = "",
                                               }: CompetitionDisplayCardProps) {
    const color = getRandomColor(competition.id);

    return (
        <Card
            onClick={onClick}
            className={`w-[250px] h-[250px] rounded-lg overflow-hidden transition cursor-pointer p-0 card-lighter  ${className}`}
        >
            {/* Top: Image or fallback color */}
            {competition.imageUrl ? (
                <img
                    src={competition.imageUrl}
                    alt={competition.title}
                    className="h-[125px] w-full object-cover"
                />
            ) : (
                <div className="h-[125px] w-full" style={{ backgroundColor: color }} />
            )}

            {/* Bottom: Info */}
            <div className="pt-0 pb-2 px-2 text-md space-y-1">
                <div className="font-semibold truncate">{competition.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                    {competition.description}
                </div>
                <div className="text-sm ">
                    {formatDate(competition.startDate)} → {formatDate(competition.endDate)}
                </div>
            </div>
        </Card>
    );
}
