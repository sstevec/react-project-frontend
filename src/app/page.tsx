"use client"

import MealListCard from "@/components/stats/meal-list-card";
import ConcentricRingStats from "@/components/stats/concentric-ring-stats";
import LineGraph from "@/components/stats/line-graph";
import ExerciseListCard from "@/components/stats/exercise-list-card";
import {Card} from "@/components/ui/card";
import NutritionTable from "@/components/stats/nutrition-table";
import WaterTracker from "@/components/stats/water-tracker";
import StepTracker from "@/components/stats/step-tracker";
import {useEffect, useState} from "react";
import {useAlert} from "@/components/alert/alert-provider";


export default function Home() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const uid = sessionStorage.getItem("gym-sync-id");
        if (!uid) return;
        setUserId(uid);

    }, []);


    return (
        <div className="w-full h-full min-w-[1788px] min-h-[816px] flex px-4">

            {/* Left Side - Fixed Width (380px) and Full Height */}
            <div className="w-[380px] h-full">
                <MealListCard/>
            </div>

            {/* Right Side - Remaining Width and Full Height with Gap */}
            <div className="flex-1 h-full ml-4 flex flex-col">

                {/* Upper Half - Fixed Height (340px) and Full Width */}
                <div className="h-[340px] w-full flex">

                    {/* Left Section - Fixed Width (340px) */}
                    <div className="flex-1 h-full min-w-[600px]">
                        <ConcentricRingStats userId={userId} editable={true} />
                    </div>

                    {/* Right Section - Remaining Width with Gap */}
                    <div className="w-[776px] h-full ml-4">
                        <LineGraph userId={userId} editable={true}/>
                    </div>

                </div>

                {/* Gap between Upper and Lower Half */}
                <div className="h-4"></div>

                {/* Lower Half - Remaining Height and Full Width */}
                <div className="flex-1 w-full flex min-h-0">

                    {/* Left Section - Flexible Width and Full Height */}
                    <div className="flex-1 h-full">
                        <NutritionTable/>
                    </div>

                    {/* Gap between Left and Right in Lower Half */}
                    <div className="w-4"></div>

                    {/* Right Section - Fixed Width (380px) */}
                    <div className="w-[380px] h-full flex-col flex">
                        <div className="h-[220px] w-full flex">
                            <WaterTracker/>
                        </div>

                        <div className="h-2"></div>

                        <div className="flex-1 w-full flex ">
                            <StepTracker userId={userId} editable={true}/>
                        </div>

                    </div>

                    <div className="w-4"></div>

                    {/* Right Section - Fixed Width (380px) */}
                    <div className="w-[380px] flex flex-col min-h-0 h-full">
                        <div className="flex-1 min-h-0">
                            <ExerciseListCard/>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    );
}
