
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  return (
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
          <Button
            variant="outline"
            className="w-full h-11 border-gray-300 hover:bg-gray-50/50 transition-all duration-300"
          >
            <Icons.google className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-gray-700">Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">
                Or register with email
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Full Name</Label>
              <Input
                className="h-11 focus-visible:ring-blue-500 border-gray-300 rounded-lg transition-all duration-300 hover:border-blue-300"
                placeholder="Somdutt Sharma"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <Input
                type="email"
                className="h-11 focus-visible:ring-blue-500 border-gray-300 rounded-lg transition-all duration-300 hover:border-blue-300"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Password</Label>
              <Input
                type="password"
                className="h-11 focus-visible:ring-blue-500 border-gray-300 rounded-lg transition-all duration-300 hover:border-blue-300"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Confirm Password</Label>
              <Input
                type="password"
                className="h-11 focus-visible:ring-blue-500 border-gray-300 rounded-lg transition-all duration-300 hover:border-blue-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Date of Birth</Label>
              <Input
                type="date"
                className="h-11 focus-visible:ring-blue-500 border-gray-300 rounded-lg transition-all duration-300 hover:border-blue-300"
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Gender</Label>
              <Select required>
                <SelectTrigger className="h-11 focus:ring-blue-500 border-gray-300 rounded-lg transition-all duration-300 hover:border-blue-300">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                  <SelectItem value="male" className="hover:bg-gray-50 focus:bg-blue-50">
                    Male
                  </SelectItem>
                  <SelectItem value="female" className="hover:bg-gray-50 focus:bg-blue-50">
                    Female
                  </SelectItem>
                  <SelectItem value="other" className="hover:bg-gray-50 focus:bg-blue-50">
                    Other
                  </SelectItem>
                  <SelectItem value="prefer-not-to-say" className="hover:bg-gray-50 focus:bg-blue-50">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex flex-col">
          <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            Create Account
          </Button>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}