'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Flame, Activity, User2, LogOut, FilePlus, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';

const MET_VALUES: Record<string, number> = {
  Run: 9.8,
  Walk: 3.5,
  Cycle: 7.5,
  Swim: 8.0,
  Hike: 6.0,
};

const calculateCalories = (type: string, duration: number, weight = 70) => {
  const MET = MET_VALUES[type] || 5;
  return Math.round((MET * weight * duration) / 60);
};

type User = {
  _id: string;
  fullName: string;
  email: string;
  gender: string;
};

type Activity = {
  _id: string;
  userId: string;
  type: string;
  distance: number;
  duration: number;
  date: string;
  notes: string;
  pace: string;
  route: [number, number][];
  createdAt: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get('/api/admin/users');
  return res.data;
};

const fetchActivities = async (): Promise<Activity[]> => {
  const res = await axios.get('/api/admin/activities');
  return res.data;
};

export default function AdminPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  const { data: activities = [], isLoading: loadingActivities } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: fetchActivities,
  });

  const selectedUser = users.find((u) => u._id === selectedUserId) ?? users[0];
  const userActivities = activities
    .filter((a) => a.userId === selectedUser?._id)
    .map((a) => ({
      ...a,
      calories: calculateCalories(a.type, a.duration),
    }));

  const totalCalories = userActivities.reduce((acc, a) => acc + a.calories, 0);

  if (loadingUsers || loadingActivities)
    return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[260px] h-screen sticky top-0 border-r bg-gradient-to-b from-indigo-600 to-blue-500 text-white flex flex-col">
        {/* Top: Logo */}
        <div className="text-2xl font-bold px-6 py-6">FitLog</div>

    
       

        {/* User List */}
        <ScrollArea className="h-[calc(100vh-240px)] px-2">
          {users.map((user) => (
            <div
              key={user._id}
              className={`cursor-pointer px-4 py-3 rounded-md mb-1 ${
                selectedUserId === user._id ||
                (!selectedUserId && users[0]._id === user._id)
                  ? 'bg-white text-black'
                  : 'hover:bg-white/20'
              }`}
              onClick={() => setSelectedUserId(user._id)}
            >
              <div className="font-medium">{user.fullName}</div>
              <div className="text-sm text-white/70">{user.email}</div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 bg-gradient-to-b from-white to-blue-50">
       <div className="sticky top-0 z-10 bg-white py-4 mb-6 flex items-center justify-between border-b">
  <h1 className="text-3xl font-bold px-2">Admin Panel</h1>
  <div className="flex gap-2 px-2">
    {/* <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800">
      <FilePlus className="w-4 h-4" />
      Add Activity
    </button>
    <button className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
      <Upload className="w-4 h-4" />
      Export Data
    </button> */}
    <button className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
      <User2 className="w-4 h-4" />
      Logout
    </button>
  </div>
</div>


        {/* Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total Activities</div>
                  <div className="text-2xl font-semibold">
                    {userActivities.length}
                  </div>
                </div>
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total Calories</div>
                  <div className="text-2xl font-semibold">
                    {totalCalories} kcal
                  </div>
                </div>
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">User</div>
                  <div className="text-2xl font-semibold">
                    {selectedUser?.fullName}
                  </div>
                </div>
                <User2 className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
  <h2 className="text-lg font-semibold mb-3">Calories Over Time</h2>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={[...userActivities]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((a) => ({
          ...a,
          formattedDate: format(new Date(a.date), 'MMM d'),
        }))}
    >
      <XAxis dataKey="formattedDate" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="calories"
        stroke="#8884d8"
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
</div>


        {/* Activity Table */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Activity History</h2>
          <div className="grid grid-cols-7 font-medium text-sm text-gray-500 border-b pb-2">
            <div>Date</div>
            <div>Type</div>
            <div>Distance</div>
            <div>Duration</div>
            <div>Pace</div>
            <div>Calories</div>
            <div>Created</div>
          </div>
          {userActivities.map((activity) => (
  <div
    key={activity._id}
    className="grid grid-cols-7 text-sm py-2 border-b last:border-none"
  >
    <div>{format(new Date(activity.date), 'dd MMM yyyy')}</div>
    <div>{activity.type}</div>
    <div>{activity.distance} km</div>
    <div>{activity.duration} mins</div>
    <div>{activity.pace}</div>
    <div>{activity.calories} kcal</div>
    <div>{format(new Date(activity.createdAt), 'dd MMM yyyy')}</div>
  </div>
))}

        </div>
      </div>
    </div>
  );
}
