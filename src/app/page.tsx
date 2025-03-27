import MealListCard from "@/components/stats/meal-list-card";
import ExerciseListCard from "@/components/stats/exercise-list-card";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/*<div className="w-80 h-120">*/}
            {/*    <MealListCard></MealListCard>*/}
            {/*</div>*/}
            <div className="w-80 h-120">
                <ExerciseListCard></ExerciseListCard>
            </div>
        </div>
    );
}
