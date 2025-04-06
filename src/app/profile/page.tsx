"use client"

import {useEffect, useState} from "react";
import ProfileInfoEditor from "@/components/profile/info-editor";
import FrequencyGrid from "@/components/profile/frequency-grid";
import {TrackerGraph} from "@/components/profile/custom-tracker-graph";
import {TrackerProgress} from "@/components/profile/custom-progress-tracker";
import MyRecentPosts from "@/components/profile/my-recent-post";

export default function ProfilePage() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        setUserId(sessionStorage.getItem("gym-sync-id"));
    }, []);

    return (
        <div className="w-[70%] min-w-[1302px] max-w-[1500px] h-full flex flex-col px-4 py-2 gap-4 mx-auto">
            {/* First Row */}
            <div className="flex w-full h-[350px] gap-4">
                <div className="w-[620px]">
                    <ProfileInfoEditor />
                </div>
                <div className="flex-1 min-w-[300px]">
                    <TrackerProgress />
                </div>
                <div className="w-[350px]">
                    <FrequencyGrid />
                </div>
            </div>

            {/* Second Row */}
            <div className="flex w-full gap-4 h-[450px]">
                <div className="flex-1">
                    <TrackerGraph />
                </div>
                <div className="flex-1 h-full">
                    <MyRecentPosts userId={userId || ""} />
                </div>
            </div>
        </div>
    );
}

