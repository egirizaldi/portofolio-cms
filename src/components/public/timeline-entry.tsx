import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/format";

export type TimelineEntryData = {
  id: string;
  title: string;
  organization: string;
  location?: string | null;
  description?: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
};

export function TimelineEntry({
  entry,
  currentLabel = "Sekarang",
}: {
  entry: TimelineEntryData;
  currentLabel?: string;
}) {
  return (
    <article className="relative border-l pb-8 pl-6 last:pb-0">
      <span
        aria-hidden
        className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
      />

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium tracking-tight">{entry.title}</h3>
        {entry.isCurrent ? (
          <Badge variant="secondary">{currentLabel}</Badge>
        ) : null}
      </div>

      <p className="mt-0.5 text-sm text-muted-foreground">
        {entry.organization}
        {entry.location ? ` · ${entry.location}` : ""}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {formatDateRange(entry.startDate, entry.endDate, entry.isCurrent)}
      </p>

      {entry.description ? (
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {entry.description}
        </p>
      ) : null}
    </article>
  );
}
