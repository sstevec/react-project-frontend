"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAlert } from "@/components/alert/alert-provider";

interface CompetitionCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function CompetitionCreateModal({ open, onClose, onCreated }: CompetitionCreateModalProps) {
    const { showAlert } = useAlert();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [objective, setObjective] = useState("");
    const [rankMethod, setRankMethod] = useState<"ascending" | "descending">("ascending");
    const [access, setAccess] = useState<"public" | "friend_only">("public");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImagePreview(null);
        }
    }, [imageFile]);

    const isBlank = (text: string) => !text.trim();

    const handleCreate = async () => {
        if ([title, description, objective, startDate, endDate].some(isBlank)) {
            showAlert("Please fill in all required fields", "error");
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("objective", objective.trim());
        formData.append("rankMethod", rankMethod);
        formData.append("access", access);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        if (imageFile) formData.append("competitionImage", imageFile);

        try {
            await axios.post("/api/competitions/create", formData);
            showAlert("Competition created!", "success");
            onClose();
            onCreated();
            setTitle("");
            setDescription("");
            setObjective("");
            setStartDate("");
            setEndDate("");
            setImageFile(null);
            setImagePreview(null);
        } catch {
            showAlert("Failed to create competition", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create New Competition</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1">
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="space-y-1">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="space-y-1">
                        <Label>Objective</Label>
                        <Input value={objective} onChange={(e) => setObjective(e.target.value)} required />
                    </div>

                    <div className="space-y-1">
                        <Label>Rank Method</Label>
                        <Select value={rankMethod} onValueChange={(val) => setRankMethod(val as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select rank method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ascending">Ascending</SelectItem>
                                <SelectItem value="descending">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>Access</Label>
                        <Select value={access} onValueChange={(val) => setAccess(val as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="friend_only">Friend Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-1 flex-1">
                            <Label>Start Date</Label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div className="space-y-1 flex-1">
                            <Label>End Date</Label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label>Cover Image (optional)</Label>
                        <Input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setImageFile(file);
                        }} />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 rounded-md max-h-48 w-auto"
                            />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}