import MealListCard from "@/components/stats/meal-list-card";
import ConcentricRingStats from "@/components/stats/concentric-ring-stats";
import LineGraph from "@/components/stats/line-graph";
import ExerciseListCard from "@/components/stats/exercise-list-card";
import {Card} from "@/components/ui/card";
import NutritionTable from "@/components/stats/nutrition-table";

export default function Home() {
    return (
        <div className="w-full h-full min-w-[1568px] min-h-[816px] overflow-auto flex">

            {/* Left Side - Fixed Width (380px) and Full Height */}
            <div className="w-[380px] h-full">
                <MealListCard/>
            </div>

            {/* Right Side - Remaining Width and Full Height with Gap */}
            <div className="flex-1 h-full ml-4 flex flex-col">

                {/* Upper Half - Fixed Height (420px) and Full Width */}
                <div className="h-[400px] w-full flex">

                    {/* Left Section - Fixed Width (380px) */}
                    <div className="w-[380px] h-full">
                        <ConcentricRingStats/>
                    </div>

                    {/* Right Section - Remaining Width with Gap */}
                    <div className="flex-1 h-full ml-4">
                        <LineGraph/>
                    </div>

                </div>

                {/* Gap between Upper and Lower Half */}
                <div className="h-4"></div>

                {/* Lower Half - Remaining Height and Full Width */}
                <div className="flex-1 w-full flex">

                    {/* Left Section - Flexible Width and Full Height */}
                    <div className="flex-1 h-full">
                        <NutritionTable/>
                    </div>

                    {/* Gap between Left and Right in Lower Half */}
                    <div className="w-4"></div>

                    {/* Right Section - Fixed Width (380px) */}
                    <div className="w-[380px] h-full">
                        <ExerciseListCard/>
                    </div>

                </div>

            </div>
        </div>


    );
}
