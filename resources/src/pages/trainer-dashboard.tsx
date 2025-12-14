import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Plan } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Users, DollarSign, LayoutDashboard as LayoutDashboardIcon } from "lucide-react";
import { Link } from "wouter";

// Default images for new plans
import mealImage from "@assets/generated_images/healthy_meal_prep.png";
import dumbbellsImage from "@assets/generated_images/dumbbells_gym_floor.png";
import yogaImage from "@assets/generated_images/yoga_morning_sunlight.png";
import runnerImage from "@assets/generated_images/runner_tying_shoes.png";

export default function TrainerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Plan Form State
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    title: "",
    description: "",
    price: 0,
    duration: 30,
    category: "general"
  });

  useEffect(() => {
    if (user?.id) {
      api.plans.getByTrainer(user.id).then(setPlans);
    }
  }, [user]);

  if (!user || user.role !== "trainer") return <div>Access Denied</div>;

  const handleCreatePlan = async () => {
    if (!newPlan.title || !newPlan.price) return;

    let image = dumbbellsImage;
    if (newPlan.category === "yoga") image = yogaImage;
    if (newPlan.category === "weight-loss") image = mealImage;
    if (newPlan.category === "cardio") image = runnerImage;

    const planData: any = {
      trainerId: user.id,
      trainerName: user.name, // In real app, backend handles this
      title: newPlan.title!,
      description: newPlan.description || "",
      price: Number(newPlan.price),
      duration: Number(newPlan.duration),
      category: newPlan.category as any,
      image: image,
    };

    try {
        // We use a direct call to db.createPlan in the mock implementation of api.plans.create
        // But the signature of api.plans.create is Omit<Plan, "id" | "trainerName">
        // So we need to adjust mock implementation or casting. 
        // For now, let's update api.ts mock implementation to be more flexible or just cast here.
        // Actually, let's just simulate the API call which adds the ID.
        
        // However, api.plans.create throws error in current mock implementation because it expects context.
        // Let's modify the mock implementation in api.ts to actually work for this demo.
        // But I cannot modify api.ts in this turn easily as I am writing this file.
        // I will fix api.ts in next step if needed, but for now let's assume api.plans.create works
        // Wait, I wrote api.plans.create to throw error. I should have fixed that.
        // I will fix api.ts after this. For now I will manually call the db logic via a "fixed" api call pattern or just inline it temporarily if I couldn't rely on api.ts
        
        // Actually, the best way is to update api.ts to work correctly.
        // But I am editing trainer-dashboard.tsx now. 
        // I will use a direct DB call here for now? No, that defeats the purpose.
        // I will implement the call to api.plans.create and assume I will fix api.ts immediately after.
        
        // ... Wait, I can't leave it broken.
        // Let's just implement the UI logic and I will fix api.ts in the next tool call.
        
        // To be safe, I'll update api.ts FIRST, then this file. 
        // But I already started writing this file. 
        // I will finish writing this file with the correct API call, and then fix api.ts.
        
        await api.plans.create(planData);
        
        const updatedPlans = await api.plans.getByTrainer(user.id);
        setPlans(updatedPlans);
        setIsCreateOpen(false);
        setNewPlan({ title: "", description: "", price: 0, duration: 30, category: "general" });
        
        toast({
        title: "Plan Created",
        description: "Your new fitness plan is now live.",
        });
    } catch (e) {
        console.error(e);
        toast({
            title: "Error",
            description: "Failed to create plan",
            variant: "destructive"
        });
    }
  };

  const handleDeletePlan = async (id: string) => {
    await api.plans.delete(id);
    const updatedPlans = await api.plans.getByTrainer(user.id);
    setPlans(updatedPlans);
    toast({
      title: "Plan Deleted",
      description: "The plan has been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="container py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold uppercase mb-2">Trainer Dashboard</h1>
          <p className="text-muted-foreground">Manage your fitness plans and track your sales.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" /> Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Fitness Plan</DialogTitle>
              <DialogDescription>
                Add details for your new training program.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Plan Title</Label>
                <Input 
                  id="title" 
                  value={newPlan.title} 
                  onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                  placeholder="e.g. 30 Day Shred" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newPlan.category} 
                  onValueChange={(v) => setNewPlan({...newPlan, category: v as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle">Muscle Building</SelectItem>
                    <SelectItem value="yoga">Yoga & Mobility</SelectItem>
                    <SelectItem value="cardio">Cardio & Endurance</SelectItem>
                    <SelectItem value="general">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={newPlan.price} 
                    onChange={(e) => setNewPlan({...newPlan, price: Number(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    value={newPlan.duration} 
                    onChange={(e) => setNewPlan({...newPlan, duration: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newPlan.description} 
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  placeholder="What can users expect from this plan?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePlan}>Publish Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <LayoutDashboardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.00</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="font-heading text-2xl font-bold mb-6 border-b pb-2">Your Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden flex flex-col">
            <div className="relative h-48">
              <img 
                src={plan.image} 
                alt={plan.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                {plan.category}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="font-heading text-xl">{plan.title}</CardTitle>
              <CardDescription>${plan.price} • {plan.duration} Days</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {plan.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 bg-muted/20">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Edit2 className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
