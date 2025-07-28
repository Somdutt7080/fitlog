"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FullScreenLoader from "@/components/ui/FullScreenLoading";


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value });
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true); 
     try {
    // 👇 Map frontend field 'dateOfBirth' → backend 'dob'
    const payload = {
      ...formData,
      dob: formData.dateOfBirth,
    };

    const res = await axios.post("/api/auth/register", payload); // 👈 Add leading slash

    if (res.status === 201) {
      router.push("/login");
    }
  } catch (err: any) {
    setError(err?.response?.data?.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <>
    {isLoading && <FullScreenLoader />}
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl rounded-2xl overflow-hidden bg-white bg-opacity-90 backdrop-blur-sm">
        <CardHeader className="p-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join FitLog
          </CardTitle>
          <CardDescription className="text-center text-gray-500 mt-2">
            Start your fitness journey with us
          </CardDescription>
        </CardHeader>


        <CardContent className="p-8 pt-0 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">
                Register with email
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Full Name</Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Somdutt Sharma"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Confirm Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Date of Birth</Label>
              <Input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Gender</Label>
              <Select required onValueChange={handleGenderChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex flex-col">
          <Button onClick={handleSubmit} className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Create Account
          </Button>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}
