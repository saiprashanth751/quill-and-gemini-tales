
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border/20 bg-gradient-to-r from-card via-background to-card">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "relative h-10 w-10 transform-gpu",
            "before:absolute before:inset-0 before:bg-primary/20 before:rounded-full before:animate-ping before:animation-delay-100",
          )}>
            <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-xl font-bold md:text-2xl bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            <span className="text-primary font-decorative">Katha</span>
            <span className="font-italic">Verse</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
