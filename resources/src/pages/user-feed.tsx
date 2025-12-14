import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { Plan } from "@/lib/mockData";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UserFeed() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Plan[]>([]);
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      api.users.getSubscriptions(user.id).then(setSubscriptions);
      api.plans.getAll().then(setAllPlans);
    }
  }, [user]);

  if (!user || user.role !== "user") return <div>Access Denied</div>;

  // Since subscriptions are fetched as plans, we need to know which ones are subscribed
  // The API returns Plan objects for subscriptions.
  // We need to efficiently check subscription status for "allPlans"
  const subscriptionIds = new Set(subscriptions.map(p => p.id));

  const filteredPlans = allPlans.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.trainerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold uppercase mb-2">My Feed</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Ready to train?</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search plans or trainers..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">Discover Plans</TabsTrigger>
          <TabsTrigger value="subscribed">My Subscriptions ({subscriptions.length})</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribed" className="mt-0">
          {subscriptions.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
              <h3 className="font-heading text-2xl font-bold mb-2 text-muted-foreground">No Subscriptions Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't purchased any training plans yet.</p>
              <Button variant="outline" onClick={() => document.querySelector('[value="all"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                Browse Plans
              </Button>
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((plan) => (
                <Link key={plan.id} href={`/plan/${plan.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all border-primary/20 bg-primary/5 cursor-pointer">
                    <div className="relative h-48">
                      <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3">
                         <Badge className="bg-primary text-white hover:bg-primary">Active</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="font-heading text-xl">{plan.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {plan.trainerName}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full bg-background rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-primary h-full w-[45%]" />
                      </div>
                      <p className="text-xs text-right text-muted-foreground">45% Completed</p>
                    </CardContent>
                    <CardFooter>
                       <Button className="w-full">Continue Training</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const isSubscribed = subscriptionIds.has(plan.id);
              return (
                <Link key={plan.id} href={`/plan/${plan.id}`}>
                  <Card className={`h-full overflow-hidden hover:shadow-lg transition-all group cursor-pointer ${isSubscribed ? 'border-primary/20' : ''}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={plan.image} 
                        alt={plan.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      {isSubscribed && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-primary font-bold">Owned</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">{plan.category}</Badge>
                        <span className="font-bold text-lg">${plan.price}</span>
                      </div>
                      <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">
                        {plan.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                           <AvatarFallback>{plan.trainerName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{plan.trainerName}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="following">
           <div className="text-center py-20 bg-muted/30 rounded-xl">
              <h3 className="font-heading text-2xl font-bold mb-2">Following Feed</h3>
              <p className="text-muted-foreground">Updates from trainers you follow will appear here.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
