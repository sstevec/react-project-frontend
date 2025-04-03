"use client"

import {useState} from "react";
import ProfileInfoEditor from "@/components/profile/info-editor";
import FrequencyGrid from "@/components/profile/frequency-grid";
import CustomTracker from "@/components/profile/custom-tracker";

export default function FriendPage() {
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

    return (
        <div className="w-[70%] min-w-[1200px] max-w-[1500px] h-full flex px-4 justify-center mx-auto">
            {/* Left Section */}
            <div className=" flex-1 flex-col gap-4">
                <div className="h-[350px]">
                    <ProfileInfoEditor/>
                </div>

                <div className="h-4"/>
                <div>
                    <CustomTracker/>
                </div>
            </div>

            {/* Middle Gap */}
            <div className="w-4"/>

            {/* Right Section */}
            <div className="w-[350px]">
                <FrequencyGrid/>
            </div>
        </div>


    );
}
