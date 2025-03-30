"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useAlert} from "@/components/alert/alert-provider";
import {useRouter} from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function AuthPage() {
    const {showAlert} = useAlert();
    const router = useRouter();
    const [formType, setFormType] = useState("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        dateOfBirth: "",
        gender: "",
        weight: "",
        height: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        let endpoint = "";

        if (formType === "login") {
            endpoint = "/api/auth/login";
        } else if (formType === "signup") {
            endpoint = "/api/auth/register";
            if (formData.password !== formData.confirmPassword) {
                showAlert("Password does not match", "warning");
                return;
            }
        } else if (formType === "forgot") {
            endpoint = "/api/auth/modify-password";
        }

        try {
            const {data} = await axiosInstance.post(endpoint, formData);

            if (formType === "login") {
                if (data.payload.jwt) {
                    sessionStorage.setItem("gym-sync-jwt-token", data.payload.jwt);
                    sessionStorage.setItem("gym-sync-id", data.payload.id);
                    sessionStorage.setItem("gym-sync-name", data.payload.name);
                    sessionStorage.setItem("gym-sync-email", data.payload.email);
                } else {
                    showAlert("Login Failed", "error");
                    return
                }
                showAlert("Login Success", "success");
                router.push("/");
            } else if (formType === "signup") {
                showAlert("Create Account Success", "success");
                setFormType("login");
            } else if (formType === "forgot") {
                showAlert("Change Password Success", "success");
                setFormType("login");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Network error, please try again.";
            showAlert(`Error: ${message}`, "error");
        }
    };


    return (
        <div className="flex h-screen">
            {/* Left Box (60%) */}
            <div className="w-3/5 h-screen flex justify-center items-center">
                {/* Image Placeholder */}
                <div className="h-50 w-50 bg-primary text-amber-50 p-4 rounded-lg ">Replace Me!</div>
            </div>

            {/* Right Box (40%) */}
            <div className="w-2/5 flex justify-center items-center">
                <div className="w-4/5 ">

                    {formType === "login" && (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Sign In</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="my-4">
                                    <Label>Email</Label>
                                    <Input type="email" name="email" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Password</Label>
                                    <Input type="password" name="password" required onChange={handleChange}/>
                                </div>
                                <div className="flex justify-between text-sm">
                    <span className="text-blue-600 cursor-pointer" onClick={() => setFormType("signup")}>
                      Don't have an account?
                    </span>
                                    <span className="text-blue-600 cursor-pointer"
                                          onClick={() => setFormType("forgot")}>
                      Forgot password?
                    </span>
                                </div>
                                <Button type="submit" className="w-full btn-highlight">
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
                                    <Input type="text" name="name" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input type="email" name="email" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Password</Label>
                                    <Input type="password" name="password" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Confirm Password</Label>
                                    <Input type="password" name="confirmPassword" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Date of Birth</Label>
                                    <Input type="date" name="dateOfBirth" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Gender</Label>
                                    <Select onValueChange={(value) => setFormData({...formData, gender: value})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Body Weight (kg)</Label>
                                    <Input type="number" name="weight" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Height (cm)</Label>
                                    <Input type="number" name="height" required onChange={handleChange}/>
                                </div>
                                <span className="text-blue-600 text-sm cursor-pointer"
                                      onClick={() => setFormType("login")}>
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
                                    <Input type="email" name="email" required onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>New Password</Label>
                                    <Input type="password" name="password" required onChange={handleChange}/>
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
