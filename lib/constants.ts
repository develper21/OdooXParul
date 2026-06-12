export const APP_NAME = "Traveloop";
export const APP_DESCRIPTION = "Premium travel planning SaaS application";
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000";

// Navigation
export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Trips", href: "/trips", icon: "MapPin" },
  { label: "Create Trip", href: "/trips/create", icon: "Plus" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

// Trip Status
export const TRIP_STATUS = {
  PLANNING: "planning",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

// Activity Categories
export const ACTIVITY_CATEGORIES = [
  "Sightseeing",
  "Dining",
  "Activities",
  "Entertainment",
  "Shopping",
  "Transportation",
  "Accommodation",
  "Other",
] as const;

// Budget Categories
export const BUDGET_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Dining",
  "Activities",
  "Shopping",
  "Other",
] as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  "Easy",
  "Moderate",
  "Challenging",
  "Expert",
] as const;

// Traveler Types
export const TRAVELER_TYPES = [
  "Solo",
  "Couples",
  "Family",
  "Friends",
  "Group Tour",
] as const;

// Transport Modes
export const TRANSPORT_MODES = [
  "Flight",
  "Train",
  "Bus",
  "Car",
  "Ferry",
  "Walking",
] as const;

// Colors
export const COLORS = {
  primary: "#a855f7", // Purple
  secondary: "#06b6d4", // Cyan
  accent: "#0ea5e9", // Blue
  success: "#10b981", // Green
  warning: "#f59e0b", // Amber
  error: "#ef4444", // Red
  dark: "#0f172a", // Dark Navy
  light: "#f1f5f9", // Light Gray
} as const;

// Pagination
export const ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_LARGE = 50;

// Date Formats
export const DATE_FORMAT = "MMMM dd, yyyy";
export const DATE_FORMAT_SHORT = "MMM dd";
export const TIME_FORMAT = "HH:mm";

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  trips: "/api/trips",
  itineraries: "/api/itineraries",
  activities: "/api/activities",
  budgets: "/api/budgets",
  users: "/api/users",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  INVALID_INPUT: "Please check your input and try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  TRIP_CREATED: "Trip created successfully!",
  TRIP_UPDATED: "Trip updated successfully!",
  TRIP_DELETED: "Trip deleted successfully!",
  ACTIVITY_ADDED: "Activity added successfully!",
  SETTINGS_SAVED: "Settings saved successfully!",
} as const;
