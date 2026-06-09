import { Eye } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* logo */}

      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Maktab M
      </span>
    </div>
  );
}