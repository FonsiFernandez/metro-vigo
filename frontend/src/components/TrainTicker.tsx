import { TrainFront } from "lucide-react";

export default function TrainTicker() {
  return (
    <div className="relative h-10 overflow-hidden rounded-xl border bg-muted/20">
      {/* Rail (slightly lower so the train doesn't look "pushed down") */}
      <div className="absolute left-0 right-0 top-[60%] -translate-y-1/2">
        <div className="mx-4 h-[2px] bg-muted" />
        <div className="mx-4 mt-2 h-[2px] bg-muted" />
      </div>

      {/* Moving train (centered but nudged up a bit) */}
      <div className="absolute left-[-60px] top-1/2 -translate-y-1/2 -translate-y-[6px] animate-train">
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1 shadow-sm">
          <TrainFront className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">next</span>
        </div>
      </div>
    </div>
  );
}
