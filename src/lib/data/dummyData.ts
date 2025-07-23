
// Weekly Data (Dashboard)
export const weeklyData = [
  { day: "Mon", km: 4 },
  { day: "Tue", km: 6 },
  { day: "Wed", km: 3.5 },
  { day: "Thu", km: 5 },
  { day: "Fri", km: 7 },
  { day: "Sat", km: 6.5 },
  { day: "Sun", km: 5.5 },
];

// Monthly Data (Dashboard)
export const monthlyData = [
  { month: "Jan", distance: 75 },
  { month: "Feb", distance: 52 },
  { month: "Mar", distance: 68 },
  { month: "Apr", distance: 60 },
  { month: "May", distance: 10 },
  { month: "Jun", distance: 85 },
];

// Calories Chart (Analytics)
export const caloriesData = [
  { day: "Mon", calories: 250 },
  { day: "Tue", calories: 300 },
  { day: "Wed", calories: 200 },
  { day: "Thu", calories: 400 },
  { day: "Fri", calories: 350 },
  { day: "Sat", calories: 500 },
  { day: "Sun", calories: 450 },
];

// Pace LineChart (Analytics)
export const paceData = [
  { day: "Mon", pace: 6.2 },
  { day: "Tue", pace: 5.8 },
  { day: "Wed", pace: 6.5 },
  { day: "Thu", pace: 5.9 },
  { day: "Fri", pace: 6.1 },
  { day: "Sat", pace: 5.7 },
  { day: "Sun", pace: 6.3 },
];

// Table Data (Analytics)
export const statTable = [
  { day: "Mon", distance: 4.5, duration: 28, calories: 250, pace: "6.2" },
  { day: "Tue", distance: 5.0, duration: 29, calories: 300, pace: "5.8" },
  { day: "Wed", distance: 3.8, duration: 25, calories: 200, pace: "6.5" },
  { day: "Thu", distance: 5.2, duration: 30, calories: 400, pace: "5.9" },
  { day: "Fri", distance: 5.6, duration: 34, calories: 350, pace: "6.1" },
  { day: "Sat", distance: 6.0, duration: 33, calories: 500, pace: "5.7" },
  { day: "Sun", distance: 5.3, duration: 32, calories: 450, pace: "6.3" },
];


// mapview-data

export type Route = {
  id: number;
  name: string;
  type: string;
  date: string;
  position: [number, number];
};

export const routesData: Route[] = [
  {
    id: 1,
    name: "Morning Run",
    type: "Run",
    date: "2025-07-15",
    position: [28.6139, 77.209],
  },
  {
    id: 2,
    name: "Evening Walk",
    type: "Walk",
    date: "2025-07-10",
    position: [28.62, 77.21],
  },
  {
    id: 3,
    name: "Ride to Park",
    type: "Ride",
    date: "2025-07-08",
    position: [28.61, 77.22],
  },
];
