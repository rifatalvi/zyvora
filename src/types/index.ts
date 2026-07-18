// ── User Types ─────────────────────────────────────────────────
export type UserRole = 'learner' | 'provider';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  interests?: string[];
  createdAt: string;
}

// ── Item / Course Types ────────────────────────────────────────
export type ItemCategory =
  | 'Programming'
  | 'Design'
  | 'Data Science'
  | 'Business'
  | 'Marketing'
  | 'Photography'
  | 'Music'
  | 'Personal Development'
  | 'Language'
  | 'Health & Fitness';

export type ItemType = 'course' | 'mentorship';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Review {
  _id: string;
  user: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Item {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ItemCategory;
  type: ItemType;
  difficulty: DifficultyLevel;
  price: number;
  thumbnail: string;
  images: string[];
  tags: string[];
  instructor: { _id: string; name: string; avatar?: string };
  instructorName: string;
  instructorAvatar?: string;
  duration: string;
  language: string;
  totalEnrolled: number;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  isPublished: boolean;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── API Response Types ─────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ItemsResponse {
  success: boolean;
  items: Item[];
  pagination: PaginationMeta;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// ── Filter Types ───────────────────────────────────────────────
export interface ItemFilters {
  search?: string;
  category?: string;
  type?: string;
  difficulty?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}
