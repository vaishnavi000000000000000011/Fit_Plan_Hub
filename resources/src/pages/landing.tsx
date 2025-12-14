import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plan } from "@/lib/mockData";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import heroImage from "@assets/generated_images/modern_gym_hero_image.png";
import { ArrowRight, Star, Clock, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [featuredPlans, setFeaturedPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const allPlans = await api.plans.getAll();
        setFeaturedPlans(allPlans.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch plans", error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Fitness Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tight">
              Transform Your <span className="text-primary">Body</span><br />
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">Mind</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
              Access world-class fitness plans from elite trainers. 
              Start your journey today with plans tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="text-lg px-8 h-14 bg-primary hover:bg-primary/90 text-white border-0">
                  Start Training Now
                </Button>
              </Link>
              <Link href="#plans">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  Explore Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: "Elite Trainers", desc: "Learn from the best certified professionals in the industry." },
              { icon: Clock, title: "Flexible Plans", desc: "Workouts that fit your schedule, from 15 mins to 2 hours." },
              { icon: Star, title: "Proven Results", desc: "Thousands of success stories from our community." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section id="plans" className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-heading text-4xl font-bold mb-2 uppercase">Featured Plans</h2>
              <p className="text-muted-foreground">Top rated programs to get you started</p>
            </div>
            <Link href="/auth">
              <Button variant="ghost" className="hidden sm:flex group">
                View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlans.map((plan) => (
              <Link key={plan.id} href={`/plan/${plan.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-border/50 bg-card">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={plan.image} 
                      alt={plan.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/70 backdrop-blur-md text-white border-0">
                        {plan.duration} Days
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{plan.trainerName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground font-medium">{plan.trainerName}</span>
                    </div>
                    <CardTitle className="font-heading text-2xl uppercase group-hover:text-primary transition-colors">
                      {plan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {plan.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <span className="font-bold text-lg">${plan.price}</span>
                    <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors">
                      View Plan
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
