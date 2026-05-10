export const DUMMY_TRIPS = [
  {
    id: "trip-1",
    title: "Bali Adventure",
    destination: "Bali, Indonesia",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    travelers: 4,
    budget: 3000,
    status: "planning",
    description: "Beach relaxation and temple exploration",
  },
  {
    id: "trip-2",
    title: "European Summer",
    destination: "Paris, Amsterdam, Berlin",
    startDate: "2024-06-01",
    endDate: "2024-06-21",
    travelers: 2,
    budget: 5000,
    status: "planning",
    description: "City tour across Europe",
  },
  {
    id: "trip-3",
    title: "Japan Exploration",
    destination: "Tokyo, Kyoto, Osaka",
    startDate: "2024-09-10",
    endDate: "2024-09-24",
    travelers: 3,
    budget: 4500,
    status: "planning",
    description: "Experience Japanese culture and cuisine",
  },
  {
    id: "trip-4",
    title: "New York Weekend",
    destination: "New York, USA",
    startDate: "2024-04-05",
    endDate: "2024-04-08",
    travelers: 2,
    budget: 1500,
    status: "ongoing",
    description: "City that never sleeps",
  },
];

export const DUMMY_ACTIVITIES = [
  {
    id: "activity-1",
    tripId: "trip-1",
    title: "Arrive at Airport",
    location: "Bali Airport",
    date: "2024-03-15",
    time: "14:00",
    category: "Transportation",
    cost: 0,
    duration: 2,
  },
  {
    id: "activity-2",
    tripId: "trip-1",
    title: "Beach Day at Seminyak",
    location: "Seminyak Beach",
    date: "2024-03-16",
    time: "09:00",
    category: "Activities",
    cost: 0,
    duration: 8,
  },
  {
    id: "activity-3",
    tripId: "trip-1",
    title: "Temple Visit - Tanah Lot",
    location: "Tanah Lot Temple",
    date: "2024-03-17",
    time: "16:00",
    category: "Sightseeing",
    cost: 25,
    duration: 3,
  },
  {
    id: "activity-4",
    tripId: "trip-2",
    title: "Arrive at Charles de Gaulle",
    location: "Paris Airport",
    date: "2024-06-01",
    time: "10:00",
    category: "Transportation",
    cost: 300,
    duration: 3,
  },
];

export const DUMMY_BUDGET_ITEMS = {
  "trip-1": {
    accommodation: [
      { id: "1", name: "Hotel Bali Benoa", amount: 800, date: "2024-03-15" },
      { id: "2", name: "Airbnb Villa", amount: 500, date: "2024-03-18" },
    ],
    dining: [
      { id: "3", name: "Restaurant Kayuputi", amount: 150, date: "2024-03-16" },
      { id: "4", name: "Local Warungs", amount: 200, date: "2024-03-17" },
    ],
    activities: [
      { id: "5", name: "Water Sports", amount: 300, date: "2024-03-16" },
      { id: "6", name: "Temple Tours", amount: 200, date: "2024-03-17" },
    ],
  },
};

export const DUMMY_USER = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/avatar-1.jpg",
  joinedDate: "2024-01-15",
  preferences: {
    theme: "dark",
    language: "en",
    currency: "USD",
    notifications: true,
  },
};

export const DUMMY_DESTINATIONS = [
  { id: "1", name: "Bali", country: "Indonesia", region: "Southeast Asia" },
  { id: "2", name: "Paris", country: "France", region: "Europe" },
  { id: "3", name: "Tokyo", country: "Japan", region: "Asia" },
  { id: "4", name: "New York", country: "USA", region: "North America" },
  { id: "5", name: "Barcelona", country: "Spain", region: "Europe" },
  { id: "6", name: "Dubai", country: "UAE", region: "Middle East" },
  { id: "7", name: "Bangkok", country: "Thailand", region: "Southeast Asia" },
  { id: "8", name: "Rome", country: "Italy", region: "Europe" },
];

export const DUMMY_STATS = {
  totalTrips: 12,
  totalDays: 45,
  totalBudget: 25000,
  totalSpent: 18500,
  averageTripDuration: 7,
  favoriteDestination: "Bali",
};

export const DUMMY_ITINERARY = [
  {
    day: 1,
    date: "2024-03-15",
    activities: [
      {
        title: "Arrive at Airport",
        time: "14:00",
        location: "Bali Airport",
        notes: "Pick up rental car",
      },
      {
        title: "Check-in at Hotel",
        time: "17:00",
        location: "Hotel Bali Benoa",
        notes: "Rest and refresh",
      },
    ],
  },
  {
    day: 2,
    date: "2024-03-16",
    activities: [
      {
        title: "Breakfast",
        time: "08:00",
        location: "Hotel Restaurant",
        notes: "Indonesian breakfast",
      },
      {
        title: "Beach Day at Seminyak",
        time: "09:00",
        location: "Seminyak Beach",
        notes: "Swimming and relaxation",
      },
    ],
  },
];
