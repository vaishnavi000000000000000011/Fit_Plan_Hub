import { useState, useEffect } from "react";
import heroImage from "@assets/generated_images/modern_gym_hero_image.png";
import mealImage from "@assets/generated_images/healthy_meal_prep.png";
import dumbbellsImage from "@assets/generated_images/dumbbells_gym_floor.png";
import yogaImage from "@assets/generated_images/yoga_morning_sunlight.png";
import runnerImage from "@assets/generated_images/runner_tying_shoes.png";

export type Role = "user" | "trainer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  following?: string[]; // IDs of trainers followed
}

export interface Plan {
  id: string;
  trainerId: string;
  trainerName: string;
  title: string;
  description: string;
  price: number;
  duration: number; // days
  image: string;
  category: "weight-loss" | "muscle" | "yoga" | "cardio" | "general";
}

export interface Subscription {
  userId: string;
  planId: string;
  startDate: string;
}

// Initial Mock Data
const MOCK_TRAINERS: User[] = [
  {
    id: "t1",
    name: "Alex Rivera",
    email: "alex@fit.com",
    role: "trainer",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=faces",
    following: [],
  },
  {
    id: "t2",
    name: "Sarah Chen",
    email: "sarah@fit.com",
    role: "trainer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    following: [],
  },
];

const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Jordan Lee",
    email: "jordan@user.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=faces",
    following: ["t1"],
  },
];

const MOCK_PLANS: Plan[] = [
  {
    id: "p1",
    trainerId: "t1",
    trainerName: "Alex Rivera",
    title: "30-Day Shred",
    description: "High intensity interval training designed to burn fat fast. Includes daily workouts and meal guide.",
    price: 49.99,
    duration: 30,
    image: runnerImage,
    category: "weight-loss",
  },
  {
    id: "p2",
    trainerId: "t1",
    trainerName: "Alex Rivera",
    title: "Muscle Builder Pro",
    description: "Hypertrophy focused program for intermediate lifters. 5 days a week split.",
    price: 79.99,
    duration: 60,
    image: dumbbellsImage,
    category: "muscle",
  },
  {
    id: "p3",
    trainerId: "t2",
    trainerName: "Sarah Chen",
    title: "Morning Flow Yoga",
    description: "Start your day with energy and balance. Beginner friendly yoga sequences.",
    price: 29.99,
    duration: 14,
    image: yogaImage,
    category: "yoga",
  },
  {
    id: "p4",
    trainerId: "t2",
    trainerName: "Sarah Chen",
    title: "Clean Eating Reset",
    description: "A comprehensive nutrition plan to reset your metabolism and habits.",
    price: 19.99,
    duration: 21,
    image: mealImage,
    category: "general",
  },
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    userId: "u1",
    planId: "p1",
    startDate: new Date().toISOString(),
  },
];

// Simple in-memory store
class DataStore {
  users: User[];
  plans: Plan[];
  subscriptions: Subscription[];

  constructor() {
    this.users = [...MOCK_TRAINERS, ...MOCK_USERS];
    this.plans = [...MOCK_PLANS];
    this.subscriptions = [...MOCK_SUBSCRIPTIONS];
  }

  // User Methods
  getUser(email: string) {
    return this.users.find((u) => u.email === email);
  }

  createUser(user: User) {
    this.users.push(user);
    return user;
  }

  toggleFollow(userId: string, trainerId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;
    
    if (!user.following) user.following = [];
    
    if (user.following.includes(trainerId)) {
      user.following = user.following.filter((id) => id !== trainerId);
    } else {
      user.following.push(trainerId);
    }
    return user;
  }

  // Plan Methods
  getPlans() {
    return this.plans;
  }

  getPlan(id: string) {
    return this.plans.find((p) => p.id === id);
  }

  getTrainerPlans(trainerId: string) {
    return this.plans.filter((p) => p.trainerId === trainerId);
  }

  createPlan(plan: Plan) {
    this.plans.push(plan);
    return plan;
  }

  deletePlan(id: string) {
    this.plans = this.plans.filter((p) => p.id !== id);
  }

  // Subscription Methods
  subscribe(userId: string, planId: string) {
    const sub = {
      userId,
      planId,
      startDate: new Date().toISOString(),
    };
    this.subscriptions.push(sub);
    return sub;
  }

  hasSubscription(userId: string, planId: string) {
    return this.subscriptions.some(
      (s) => s.userId === userId && s.planId === planId
    );
  }

  getUserSubscriptions(userId: string) {
    return this.subscriptions
      .filter((s) => s.userId === userId)
      .map((s) => this.plans.find((p) => p.id === s.planId))
      .filter((p): p is Plan => !!p);
  }
}

export const db = new DataStore();
