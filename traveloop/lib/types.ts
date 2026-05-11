// Trip Types
export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  status: "planning" | "ongoing" | "completed" | "archived";
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Types
export interface Activity {
  id: string;
  tripId: string;
  title: string;
  location: string;
  date: string;
  time: string;
  category: string;
  cost?: number;
  duration?: number;
  description?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Budget Types
export interface BudgetItem {
  id: string;
  tripId: string;
  category: string;
  name: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetSummary {
  tripId: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  byCategory: {
    [key: string]: number;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: Date;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  currency: string;
  notifications: boolean;
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description?: string;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Itinerary Types
export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  notes?: string;
}

// Component Props
export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: "light" | "dark" | "default";
}

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export interface TripCardProps {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  image?: string;
  onClick?: () => void;
}

export interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export interface ActivityCardProps {
  title: string;
  location: string;
  time: string;
  cost?: number;
  category?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface BudgetCardProps {
  title: string;
  spent: number;
  budget: number;
  currency?: string;
  items?: Array<{
    name: string;
    amount: number;
  }>;
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Search Types
export interface TripFilter {
  status?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface SearchParams {
  query: string;
  type?: "trip" | "activity" | "destination";
  limit?: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Chart Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// Trip Member Types
export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: "owner" | "organizer" | "member";
  status: "pending" | "accepted" | "declined";
  invitedBy: string;
  invitedAt: Date;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Trip Member with User Information (from API response)
export interface TripMemberWithUser extends TripMember {
  user?: {
    _id: string;
    name?: string;
    email: string;
    avatar?: string;
  } | null;
}

// Invitation Types
export interface Invitation {
  id: string;
  tripId: string;
  tripTitle: string;
  tripDestination: string;
  invitedEmail: string;
  invitedUserId?: string;
  invitedBy: string;
  token: string;
  status: "pending" | "accepted" | "declined" | "expired";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Trip Types with Members
export interface TripWithMembers extends Trip {
  members: TripMember[];
  memberCount: number;
}
