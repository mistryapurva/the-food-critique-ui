export enum UserType {
  USER = "USER",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserType;
  status?: UserStatus;
  createdOn?: string;
  updatedOn?: string;
}

export enum RestaurantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Restaurant {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  owner: string;
  status: RestaurantStatus;
  createdOn?: string;
  updatedOn?: string;
  avgRating?: number;
}

export enum ReviewStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Review {
  _id?: string;
  restaurant: Restaurant;
  author: User;
  rating: number;
  comment?: string;
  status?: ReviewStatus;
  dateVisit?: string;
  createdOn?: string;
  updatedOn?: string;
  otherComments?: Array<ReviewComment>;
}

export interface ReviewComment {
  _id?: string;
  author: User;
  comment: string;
  status: ReviewStatus;
  createdOn?: Date;
  updatedOn?: Date;
}

export type RatingFilterEnum = "0" | "1" | "2" | "3" | "4" | "5";
