import { User, Plan, Subscription } from "./mockData.ts";

// This interface mimics what your Java SpringBoot Controller should provide.
// When you build your backend, ensure your @RestController endpoints match these paths.

export interface ApiClient {
  auth: {
    login: (email: string) => Promise<User>;
    signup: (name: string, email: string, role: "user" | "trainer") => Promise<User>;
    logout: () => Promise<void>;
    me: () => Promise<User | null>;
  };
  plans: {
    getAll: () => Promise<Plan[]>;
    getById: (id: string) => Promise<Plan | undefined>;
    create: (plan: Omit<Plan, "id" | "trainerName">) => Promise<Plan>;
    update: (id: string, plan: Partial<Plan>) => Promise<Plan>;
    delete: (id: string) => Promise<void>;
    getByTrainer: (trainerId: string) => Promise<Plan[]>;
  };
  users: {
    follow: (userId: string, trainerId: string) => Promise<void>;
    unfollow: (userId: string, trainerId: string) => Promise<void>;
    getSubscriptions: (userId: string) => Promise<Plan[]>;
    subscribe: (userId: string, planId: string) => Promise<void>;
  };
}

// ============================================================================
// MOCK IMPLEMENTATION (Replace this with fetch() calls when Backend is ready)
// ============================================================================

import { db } from "./mockData.ts";

export const api: ApiClient = {
  auth: {
    login: async (email) => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network latency
      const user = db.getUser(email);
      if (!user) throw new Error("Invalid credentials");
      return user;
    },
    signup: async (name, email, role) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        following: [],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      };
      db.createUser(newUser);
      return newUser;
    },
    logout: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
    me: async () => {
      // In a real app, this would check the session/JWT
      return null; 
    }
  },
  plans: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return db.getPlans();
    },
    getById: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return db.getPlan(id);
    },
    create: async (planData) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Mimic backend logic: Look up trainer details from the DB using trainerId
      const trainer = db.users.find(u => u.id === planData.trainerId);
      if (!trainer) throw new Error("Trainer not found");

      const newPlan: Plan = {
        ...planData,
        id: Math.random().toString(36).substr(2, 9),
        trainerName: trainer.name, // Backend populates this
      };

      db.createPlan(newPlan);
      return newPlan;
    },
    update: async (id, data) => {
        throw new Error("Not implemented in mock");
    },
    delete: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      db.deletePlan(id);
    },
    getByTrainer: async (trainerId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return db.getTrainerPlans(trainerId);
    }
  },
  users: {
    follow: async (userId, trainerId) => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        db.toggleFollow(userId, trainerId);
    },
    unfollow: async (userId, trainerId) => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        db.toggleFollow(userId, trainerId);
    },
    getSubscriptions: async (userId) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return db.getUserSubscriptions(userId);
    },
    subscribe: async (userId, planId) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        db.subscribe(userId, planId);
    }
  }
};
