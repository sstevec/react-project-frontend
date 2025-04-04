"use client"

import ConcentricRingStats from "@/components/stats/concentric-ring-stats";
import LineGraph from "@/components/stats/line-graph";
import WaterTrackerViewOnly from "@/components/friend/water-tracker";
import StepTracker from "@/components/stats/step-tracker";
import {useState} from "react";
import FriendList from "@/components/friend/friend-list";
import FriendActiveCompetitions from "@/components/friend/active-competition";
import FriendRecentPosts from "@/components/friend/recent-post";

export default function FriendPage() {
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

    return (
        <div className="w-full h-full min-w-[1788px] min-h-[816px] flex px-4">

            {/* Left Side - Fixed Width (380px) and Full Height */}
            <div className="w-[380px] h-full">
                <FriendList onFriendSelect={setSelectedFriendId}/>
            </div>

            {/* Right Side - Remaining Width and Full Height with Gap */}
            {selectedFriendId && (<div className="flex-1 h-full ml-4 flex flex-col min-h-0">

                {/* Upper Half - Fixed Height (340px) and Full Width */}
                <div className="h-[340px] w-full flex">

                    {/* Left Section - Fixed Width (380px) */}
                    <div className="flex-1 h-full min-w-[600px]">
                        <ConcentricRingStats userId={selectedFriendId} editable={false}/>
                    </div>

                    {/* Right Section - Remaining Width with Gap */}
                    <div className="w-[776px] h-full ml-4">
                        <LineGraph userId={selectedFriendId} editable={false}/>
                    </div>

                </div>

                {/* Gap between Upper and Lower Half */}
                <div className="h-4"></div>

                {/* Lower Half - Remaining Height and Full Width */}
                <div className="flex-1 w-full flex min-h-0">

                    <div className="w-[380px] h-full flex-col flex">
                        <div className="h-[200px] w-full flex">
                            <WaterTrackerViewOnly userId={selectedFriendId} editable={false}/>
                        </div>

                        <div className="h-2"></div>

                        <div className="flex-1 w-full flex items-stretch min-h-0">
                            <StepTracker userId={selectedFriendId} editable={false}/>
                        </div>
                    </div>

                    {/* Gap between Left and Right in Lower Half */}
                    <div className="w-4"></div>

                    {/* Middle and Right Section split remaining space */}
                    <div className="flex-1 h-full min-h-0 flex gap-4">
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <FriendRecentPosts friendId={selectedFriendId}/>
                        </div>
                        <div className="flex-1 min-h-0 max-w-[776px]">
                            <FriendActiveCompetitions friendId={selectedFriendId}></FriendActiveCompetitions>
                        </div>
                    </div>

                </div>

            </div>)}
        </div>
    );
}
