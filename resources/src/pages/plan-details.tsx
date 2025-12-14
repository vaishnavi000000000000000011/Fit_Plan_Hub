import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { api } from "@/lib/api";
import { Plan } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Check, Lock, PlayCircle, FileText, UserPlus, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PlanDetails() {
  const [match, params] = useRoute("/plan/:id");
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [plan, setPlan] = useState<Plan | undefined>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const fetchPlanDetails = async () => {
        const foundPlan = await api.plans.getById(params.id!);
        setPlan(foundPlan);
        
        if (user && foundPlan) {
           // Check subscription
           const subscriptions = await api.users.getSubscriptions(user.id);
           setIsSubscribed(subscriptions.some(s => s.id === foundPlan.id));
           
           // Check following
           // In real API this might be api.users.isFollowing(user.id, foundPlan.trainerId)
           // For now we assume user object has following list (or we fetch user details)
           // But since user object in auth context is static for now, we rely on it.
           // However, api.users.follow updates the DB but maybe not the auth context immediately?
           // Ideally we should refetch "me"
           if (user.following?.includes(foundPlan.trainerId)) {
             setIsFollowing(true);
           }
        }
      };
      fetchPlanDetails();
    }
  }, [params?.id, user]);

  const handleSubscribe = async () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    if (user.role === "trainer") {
      toast({
        title: "Trainer Account",
        description: "Switch to a user account to purchase plans.",
        variant: "destructive"
      });
      return;
    }

    if (plan) {
      await api.users.subscribe(user.id, plan.id);
      setIsSubscribed(true);
      toast({
        title: "Successfully Subscribed!",
        description: `You now have access to ${plan.title}.`,
      });
    }
  };

  const handleFollow = async () => {
     if (!user || !plan) return;
     
     if (isFollowing) {
        await api.users.unfollow(user.id, plan.trainerId);
        setIsFollowing(false);
        toast({ title: "Unfollowed", description: `You unfollowed ${plan.trainerName}` });
     } else {
        await api.users.follow(user.id, plan.trainerId);
        setIsFollowing(true);
        toast({ title: "Following", description: `You are now following ${plan.trainerName}` });
     }
  };

  if (!plan) return <div className="p-10 text-center">Loading plan...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 container">
          <Badge className="mb-4 text-sm px-3 py-1">{plan.category}</Badge>
          <h1 className="font-heading text-5xl font-bold uppercase mb-2 text-foreground">{plan.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{plan.duration} Days Program</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{plan.trainerName}</span>
              <Button 
                variant={isFollowing ? "secondary" : "outline"} 
                size="sm" 
                className="h-6 text-xs"
                onClick={handleFollow}
                disabled={!user}
              >
                {isFollowing ? <><UserCheck className="h-3 w-3 mr-1"/> Following</> : <><UserPlus className="h-3 w-3 mr-1"/> Follow</>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">About this Plan</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {plan.description}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Plan Schedule</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${isSubscribed ? 'bg-card hover:bg-accent/50 cursor-pointer' : 'bg-muted/30 opacity-75'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${isSubscribed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {day}
                    </div>
                    <div>
                      <h4 className="font-bold">Day {day}: {['Full Body Power', 'HIIT Cardio', 'Active Recovery', 'Upper Body Strength', 'Lower Body Focus'][day-1]}</h4>
                      <p className="text-sm text-muted-foreground">45 mins • Intermediate</p>
                    </div>
                  </div>
                  {isSubscribed ? (
                    <PlayCircle className="h-6 w-6 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
              {!isSubscribed && (
                 <div className="text-center p-4 text-muted-foreground italic">
                    + {plan.duration - 5} more days available after purchase
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border shadow-lg rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground">Total Price</span>
                <span className="text-4xl font-bold text-primary">${plan.price}</span>
              </div>

              {isSubscribed ? (
                <div className="space-y-4">
                   <div className="bg-green-500/10 text-green-600 p-4 rounded-lg flex items-center gap-2 border border-green-500/20">
                     <Check className="h-5 w-5" />
                     <span className="font-bold">You own this plan</span>
                   </div>
                   <Button className="w-full h-12 text-lg" size="lg">
                     Start Workout
                   </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" /> Full {plan.duration}-day access
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" /> Mobile & Desktop friendly
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" /> Trainer support
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" /> Lifetime access
                    </li>
                  </ul>
                  <Button onClick={handleSubscribe} className="w-full h-12 text-lg shadow-lg shadow-primary/20" size="lg">
                    Buy Now
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    One-time payment. No hidden fees.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
