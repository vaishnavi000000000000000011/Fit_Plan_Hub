import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "./mockData.ts";
import { api } from "./api.ts";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string, role: "user" | "trainer") => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (email: string) => {
    try {
      const foundUser = await api.auth.login(email);
      setUser(foundUser);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not found. Try 'alex@fit.com' (trainer) or 'jordan@user.com' (user).",
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, role: "user" | "trainer") => {
     try {
       const newUser = await api.auth.signup(name, email, role);
       setUser(newUser);
       toast({
        title: "Account created!",
        description: "Welcome to FitPlanHub.",
      });
     } catch (error) {
       console.error("Signup failed", error);
       toast({
         variant: "destructive",
         title: "Error",
         description: "Failed to create account.",
       });
     }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
