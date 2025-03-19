"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuthPage() {
    const [formType, setFormType] = useState("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        dateOfBirth: "",
        gender: "",
        weight: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        let endpoint = "";

        if (formType === "login") {
            endpoint = "/api/auth/login";
        } else if (formType === "signup") {
            endpoint = "/api/auth/register";
        } else if (formType === "forgot") {
            endpoint = "/api/auth/modify-password";
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert("Network error, please try again.");
        }
    };

    return (
        <div className="flex h-screen p-0">
            {/* Left Box (60%) */}
            <div className="w-3/5 flex justify-center items-center">
                {/* Image Placeholder */}
                <div className="bg-primary text-white p-4 rounded-lg">Hello, World!</div>
            </div>

            {/* Right Box (40%) */}
            <div className="w-2/5 flex justify-center items-center">
                <div className="w-4/5 ">

                        {formType === "login" && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Sign In</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="my-4 h-80">
                                        <Label>Email</Label>
                                        <Input type="email" name="email" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <Input type="password" name="password" required onChange={handleChange} />
                                    </div>
                                    <div className="flex justify-between text-sm">
                    <span className="text-blue-600 cursor-pointer" onClick={() => setFormType("signup")}>
                      Don't have an account?
                    </span>
                                        <span className="text-blue-600 cursor-pointer" onClick={() => setFormType("forgot")}>
                      Forgot password?
                    </span>
                                    </div>
                                    <Button type="submit" className="w-full btn-primary">
                                        Sign In
                                    </Button>
                                </form>
                            </>
                        )}

                        {formType === "signup" && (
                            <>
                                <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input type="text" name="name" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input type="email" name="email" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <Input type="password" name="password" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Confirm Password</Label>
                                        <Input type="password" name="confirmPassword" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Date of Birth</Label>
                                        <Input type="date" name="dateOfBirth" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Gender</Label>
                                        <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Body Weight (kg)</Label>
                                        <Input type="number" name="weight" required onChange={handleChange} />
                                    </div>
                                    <span className="text-blue-600 text-sm cursor-pointer" onClick={() => setFormType("login")}>
                    Already have an account?
                  </span>
                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                </form>
                            </>
                        )}

                        {formType === "forgot" && (
                            <>
                                <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Email</Label>
                                        <Input type="email" name="email" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>New Password</Label>
                                        <Input type="password" name="password" required onChange={handleChange} />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Submit
                                    </Button>
                                </form>
                            </>
                        )}

                </div>
            </div>
        </div>
    );
}
