import { useAuth } from "@/lib/authContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Dumbbell, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 font-heading text-2xl font-bold uppercase tracking-tighter text-foreground transition-colors hover:text-primary">
              <Dumbbell className="h-6 w-6 text-primary" strokeWidth={2.5} />
              FitPlan<span className="text-primary">Hub</span>
            </a>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            
            {!user ? (
              <div className="flex items-center gap-2">
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth?tab=signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {user.role === "trainer" ? (
                  <Link href="/dashboard">
                    <Button variant="ghost" className={location === "/dashboard" ? "bg-accent" : ""}>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/feed">
                    <Button variant="ghost" className={location === "/feed" ? "bg-accent" : ""}>
                      My Feed
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-medium text-foreground">Replit Agent</span>.
            Mockup Mode.
          </p>
        </div>
      </footer>
    </div>
  );
}
