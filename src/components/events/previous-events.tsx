import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PreviousEventProgram } from "@/data/events";

/**
 * Previous Events grouping shared by the home page: completed occurrences
 * grouped by program, each past date carrying a Sold Out badge, mirroring
 * the treatment on the Practice Transitions Institute site.
 */
export function PreviousEventsList({ programs }: { programs: PreviousEventProgram[] }) {
  return (
    <div className="mt-10 flex flex-wrap gap-5">
      {programs.map((program) => (
        <div
          key={program.slug}
          className="flex min-w-[280px] flex-1 flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
        >
          <h3 className="font-serif text-lg font-semibold text-foreground">{program.title}</h3>
          <ul className="space-y-3">
            {program.completedOccurrences.map((occurrence) => (
              <li
                key={`${program.slug}-${occurrence.startDateTime}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  {occurrence.dateLabel}
                </span>
                <span className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{occurrence.location}</span>
                </span>
                <Badge variant="secondary">Sold Out</Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
