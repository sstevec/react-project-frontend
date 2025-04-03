"use client";

import {useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useAlert} from "@/components/alert/alert-provider";
import {addDays, format, subDays} from "date-fns";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface TrackerEntry {
    id: string;
    createdAt: string;
    detail: trackerDetail;
}

interface trackerDetail {
    value: number
}

export default function CustomTracker() {
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("gym-sync-id") ?? "" : "";
    const {showAlert} = useAlert();
    const [customTrackers, setCustomTrackers] = useState<Record<string, string>>({});
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [entries, setEntries] = useState<Record<string, TrackerEntry[]>>({});
    const [showAddTracker, setShowAddTracker] = useState(false);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [newTrackerName, setNewTrackerName] = useState("");
    const [newTrackerGoal, setNewTrackerGoal] = useState("");
    const [entryValue, setEntryValue] = useState("");
    const [entryTracker, setEntryTracker] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        axios.get("/api/users/info")
            .then(res => {
                const rawDetail = res.data.detail || "{}";
                const parsed = JSON.parse(rawDetail);
                setCustomTrackers(parsed["custom-trackers"] || {});
            })
            .catch(() => showAlert("Failed to load user info", "error"));
    }, [userId]);

    useEffect(() => {
        if (!userId || selectedTags.length === 0) return;

        const fetchEntries = async () => {
            const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
            const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
            const result: Record<string, TrackerEntry[]> = {};

            console.log(startDate, endDate)

            for (const tag of selectedTags) {
                try {
                    const {data} = await axios.get("/api/tracker/byRange", {
                        params: {
                            userId,
                            name: tag,
                            type: "custom",
                            startDate,
                            endDate,
                        },
                    });

                    result[tag] = data || [];
                } catch {
                    showAlert(`Failed to load tracker: ${tag}`, "error");
                }
            }
            setEntries(result);
        };

        fetchEntries();
    }, [selectedTags, userId]);

    const handleAddTracker = async () => {
        if (!newTrackerName.trim() || !newTrackerGoal.trim()) return;
        try {
            const {data} = await axios.get("/api/users/info");
            const rawDetail = data.detail || "{}";
            const parsed = JSON.parse(rawDetail);
            const trackers = parsed["custom-trackers"] || {};
            trackers[newTrackerName] = newTrackerGoal;
            parsed["custom-trackers"] = trackers;

            await axios.post("/api/users/modify", {detail: JSON.stringify(parsed)});
            showAlert("Tracker added successfully", "success");
            setCustomTrackers(trackers);
            setShowAddTracker(false);
            setNewTrackerGoal("");
            setNewTrackerName("");
        } catch {
            showAlert("Failed to add tracker", "error");
        }
    };

    const handleAddEntry = async () => {
        if (!entryTracker || !entryValue.trim()) return;
        try {
            await axios.post("/api/tracker/add", {
                name: entryTracker,
                type: "custom",
                userId,
                detail: {value: entryValue},
            });
            showAlert("Entry added successfully", "success");
            setShowAddEntry(false);
            setEntryTracker(null);
            setEntryValue("");
        } catch {
            showAlert("Failed to add entry", "error");
        }
    };

    const graphData = selectedTags.flatMap(tag => {
        return entries[tag]?.map(e => ({
            date: format(new Date(e.createdAt), "MM-dd"),
            [tag]: e.detail.value
        })) || [];
    });

    return (
        <Card className="w-full p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Tag Selector */}
                <div className="flex gap-2 items-center">
                    {Object.keys(customTrackers).map((tag) => (
                        <label key={tag} className="flex items-center space-x-1">
                            <Checkbox
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() =>
                                    setSelectedTags(prev =>
                                        prev.includes(tag)
                                            ? prev.filter(t => t !== tag)
                                            : [...prev, tag]
                                    )
                                }
                            />
                            <span>{tag}</span>
                        </label>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowAddTracker(true)}>Add Tracker</Button>
                    <Button variant="outline" onClick={() => setShowAddEntry(true)}>Add Entry</Button>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphData}>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        {selectedTags.map(tag => (
                            <Line key={tag} type="monotone" dataKey={tag} strokeWidth={2} dot={{r: 3}}/>
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Add Tracker Dialog */}
            <Dialog open={showAddTracker} onOpenChange={setShowAddTracker}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add New Tracker</DialogTitle></DialogHeader>
                    <Label>Name</Label>
                    <Input value={newTrackerName} onChange={(e) => setNewTrackerName(e.target.value)}/>
                    <Label>Goal</Label>
                    <Input value={newTrackerGoal} onChange={(e) => setNewTrackerGoal(e.target.value)}/>
                    <Button onClick={handleAddTracker} className="mt-2 w-full">Confirm</Button>
                </DialogContent>
            </Dialog>

            {/* Add Entry Dialog */}
            <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add New Entry</DialogTitle></DialogHeader>
                    <Label>Tracker</Label>
                    <Select value={entryTracker ?? undefined} onValueChange={(val) => setEntryTracker(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select tracker"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(customTrackers).map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Label>Value</Label>
                    <Input type="number" value={entryValue} onChange={(e) => setEntryValue(e.target.value)}/>
                    <Button onClick={handleAddEntry} className="mt-2 w-full">Submit</Button>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
