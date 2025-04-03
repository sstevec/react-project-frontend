"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/components/alert/alert-provider";
import { format, parseISO } from "date-fns";

interface UserInfo {
    id: string;
    name: string;
    email: string;
    profilePicUrl: string | null;
    gender: "male" | "female";
    dateOfBirth: string;
    weight: number;
    height: number;
    detail?: string;
}

export default function ProfileInfoEditor() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<UserInfo>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showAlert } = useAlert();

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get("/api/users/info");
            setUser(res.data);
            setFormData(res.data);
        } catch (err) {
            showAlert("Failed to load user info", "error");
        }
    };

    const handleSave = async () => {
        const payload = { ...formData };
        if (payload.dateOfBirth) {
            const dateOnly = payload.dateOfBirth.split("T")[0];
            payload.dateOfBirth = new Date(dateOnly).toISOString();
        }
        try {
            await axios.post("/api/users/modify", payload);
            setEditMode(false);
            fetchUserInfo();
            showAlert("Profile updated successfully", "success");
        } catch (err) {
            showAlert("Failed to update user info", "error");
        }
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("profileImage", file);
        try {
            await axios.post("/api/users/upload-profile", formData);
            fetchUserInfo();
            showAlert("Profile image updated", "success");
        } catch (err) {
            showAlert("Upload failed", "error");
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (!user) return null;

    return (
        <Card className="w-full h-[350px] flex flex-row items-center px-6 py-4 gap-6 relative">
            {/* Edit Button */}
            <div className="absolute top-4 right-4">
                <Button onClick={editMode ? handleSave : () => setEditMode(true)}>
                    {editMode ? "Save" : "Edit Profile"}
                </Button>
            </div>

            {/* Profile Image */}
            <div className="w-[300px] h-[300px] mr-4">
                <img
                    src={user.profilePicUrl || "/globe.svg"}
                    alt="Profile"
                    className="rounded-full w-full h-full object-cover cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUploadImage}
                    className="hidden"
                />
            </div>

            {/* Info Form */}
            <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                    <Label>Name</Label>
                    {editMode ? (
                        <Input
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    ) : (
                        <div>{user.name}</div>
                    )}
                </div>

                <div>
                    <Label>Gender</Label>
                    {editMode ? (
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                            className="border rounded px-2 py-1 w-full"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    ) : (
                        <div>{user.gender}</div>
                    )}
                </div>

                <div>
                    <Label>Date of Birth</Label>
                    {editMode ? (
                        <Input
                            type="date"
                            value={formData.dateOfBirth?.split("T")[0] || ""}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                    ) : (
                        <div>{user.dateOfBirth.split("T")[0]}</div>
                    )}
                </div>

                <div>
                    <Label>Weight (kg)</Label>
                    {editMode ? (
                        <Input
                            type="number"
                            value={formData.weight || 0}
                            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        />
                    ) : (
                        <div>{user.weight}</div>
                    )}
                </div>

                <div>
                    <Label>Height (cm)</Label>
                    {editMode ? (
                        <Input
                            type="number"
                            value={formData.height || 0}
                            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                        />
                    ) : (
                        <div>{user.height}</div>
                    )}
                </div>
            </div>
        </Card>
    );
}
