import Image from "next/image";
import {
  getOccurrenceRegistrationPrice,
  isOccurrenceEarlyBirdAvailable,
  type EventOccurrence,
} from "@/data/events";

export function EventOccurrenceDetails({
  occurrence,
  referenceDate,
}: {
  occurrence: EventOccurrence;
  referenceDate: Date;
}) {
  const hasDetails =
    Boolean(occurrence.flyerImage) ||
    Boolean(occurrence.headline) ||
    Boolean(occurrence.guestLabel) ||
    Boolean(occurrence.speakers?.length) ||
    Boolean(occurrence.highlights?.length) ||
    Boolean(occurrence.pricing);

  if (!hasDetails) return null;

  const earlyBirdOpen = isOccurrenceEarlyBirdAvailable(occurrence, referenceDate);
  const currentPrice = getOccurrenceRegistrationPrice(occurrence, referenceDate);

  return (
    <div className="space-y-4">
      {occurrence.flyerImage ? (
        <figure className="overflow-hidden rounded-xl border border-border/70 bg-slate-50">
          <Image
            src={occurrence.flyerImage}
            alt={
              occurrence.flyerImageAlt ??
              `Seminar flyer for ${occurrence.dateLabel} at ${occurrence.location}`
            }
            width={1200}
            height={1799}
            className="h-auto w-full object-contain"
            sizes="(min-width: 768px) 360px, 100vw"
          />
        </figure>
      ) : null}

      {occurrence.headline ? (
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
          {occurrence.headline}
        </p>
      ) : null}

      {occurrence.guestLabel ? (
        <p className="text-sm text-muted-foreground">{occurrence.guestLabel}</p>
      ) : null}

      {occurrence.speakers?.length ? (
        <div className="space-y-1">
          <p className="text-sm font-semibold">Speakers</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {occurrence.speakers.map((speaker) => (
              <li key={`${speaker.name}-${speaker.title}`}>
                {speaker.name}, {speaker.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {occurrence.highlights?.length ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">What you&apos;ll learn</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {occurrence.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {occurrence.pricing && currentPrice !== undefined ? (
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Registration</p>
          {earlyBirdOpen ? (
            <p>
              Early bird ${occurrence.pricing.earlyBirdPrice} through{" "}
              {occurrence.pricing.earlyBirdDeadlineLabel}. Standard $
              {occurrence.pricing.standardPrice} after that.
            </p>
          ) : (
            <p>Standard registration ${occurrence.pricing.standardPrice}.</p>
          )}
          <p>Additional attendees ${occurrence.pricing.guestPrice}.</p>
        </div>
      ) : null}
    </div>
  );
}
