import { Building2 } from "lucide-react";
import { BookingButton } from "@/components/booking-button";
import { DSO_PRICING_BOOKING_URL } from "@/config/site";
import { cn } from "@/lib/utils";

export function DsoPricingCallout({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl bg-ink p-7 text-white md:p-9",
        className,
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            <Building2 className="h-3.5 w-3.5" />
            DSO pricing
          </div>
          <h2 className="text-balance font-serif text-2xl font-semibold md:text-[28px]">
            Considering a DSO offer for your practice?
          </h2>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-white/75">
            Book a focused DSO pricing call with Dr. Njo to talk through current DSO valuations, deal
            structures, and whether selling to a DSO truly fits your goals.
          </p>
        </div>
        <BookingButton
          href={DSO_PRICING_BOOKING_URL}
          label="Book a DSO pricing call"
          variant="secondary"
          size="lg"
          className="shrink-0"
        />
      </div>
    </div>
  );
}
