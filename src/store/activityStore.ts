import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LatLng = [number, number];

type Activity = {
  _id: string;
  userId: string;
  type: string;
  distance: number;
  duration: number;
  date: string;
  notes: string;
  pace: string;
  route: LatLng[];
  createdAt: string;
  updatedAt: string;
};

type ActivityStore = {
  activities: Activity[];
  setActivities: (data: Activity[]) => void;
};

const useActivityStore = create<ActivityStore>()(
  persist(
    (set) => ({
      activities: [],
      setActivities: (data) => set({ activities: data }),
    }),
    {
      name: 'activity-store', // 👈 key name in localStorage
    }
  )
);

export default useActivityStore;
