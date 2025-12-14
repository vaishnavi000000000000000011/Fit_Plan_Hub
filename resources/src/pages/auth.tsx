import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Dumbbell } from "lucide-react";
import heroImage from "@assets/generated_images/modern_gym_hero_image.png";

export default function AuthPage() {
  const { login, signup, isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");

  // Signup State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [role, setRole] = useState<"user" | "trainer">("user");

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    if (user.role === "trainer") setLocation("/dashboard");
    else setLocation("/feed");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginEmail);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(signupName, signupEmail, role);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Gym Background" 
          className="w-full h-full object-cover blur-sm scale-105 opacity-60"
        />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Centered Card */}
      <div className="relative z-10 w-full max-w-md p-4 animate-in fade-in zoom-in duration-500">
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
               <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                 <Dumbbell className="h-7 w-7 text-primary" />
               </div>
            </div>
            <CardTitle className="font-heading text-3xl font-bold uppercase tracking-tight">
              FitPlan<span className="text-primary">Hub</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Join the community of elite trainers and athletes
            </p>
          </CardHeader>
          
          <div className="p-6 pt-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="alex@fit.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-11 text-lg font-bold uppercase tracking-wide" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                  </Button>
                  
                  <div className="text-xs text-center text-muted-foreground mt-4 p-3 bg-muted/50 rounded-md border border-border/50">
                    <p className="font-semibold mb-1">Demo Credentials:</p>
                    <p>Trainer: <span className="font-mono text-primary">alex@fit.com</span></p>
                    <p>User: <span className="font-mono text-primary">jordan@user.com</span></p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="John Doe" 
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <RadioGroup defaultValue="user" value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                      <div>
                        <RadioGroupItem value="user" id="r-user" className="peer sr-only" />
                        <Label
                          htmlFor="r-user"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                        >
                          <span className="mb-1 font-heading font-bold">User</span>
                          <span className="text-[10px] text-muted-foreground text-center">Get Fit</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="trainer" id="r-trainer" className="peer sr-only" />
                        <Label
                          htmlFor="r-trainer"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                        >
                          <span className="mb-1 font-heading font-bold">Trainer</span>
                          <span className="text-[10px] text-muted-foreground text-center">Coach</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button type="submit" className="w-full h-11 text-lg font-bold uppercase tracking-wide" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
