
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="border-b border-border/20 bg-card">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "relative h-8 w-8 transform-gpu",
            "before:absolute before:inset-0 before:bg-primary/20 before:rounded-full before:animate-ping before:animation-delay-100",
          )}>
            <div className="relative h-full w-full rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-primary-foreground">Q</span>
            </div>
          </div>
          <h1 className="text-xl font-bold md:text-2xl">
            <span className="text-primary">Quill</span> & <span className="font-italic">Gemini</span> Tales
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
