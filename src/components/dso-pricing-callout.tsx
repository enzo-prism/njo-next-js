import { Building2 } from "lucide-react";
import { BookingButton } from "@/components/booking-button";
import { Card } from "@/components/ui/card";
import { DSO_PRICING_BOOKING_URL } from "@/config/site";
import { cn } from "@/lib/utils";

export function DsoPricingCallout({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/20 bg-gradient-to-br from-blue-50 via-background to-background",
        className,
      )}
    >
      <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Building2 className="h-4 w-4" />
            DSO pricing
          </div>
          <h2 className="text-xl font-semibold md:text-2xl">Considering a DSO offer for your practice?</h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Book a focused DSO pricing call with Dr. Njo to talk through current DSO valuations, deal
            structures, and whether selling to a DSO fits your goals.
          </p>
        </div>
        <BookingButton
          href={DSO_PRICING_BOOKING_URL}
          label="Book a DSO pricing call"
          className="shrink-0"
        />
      </div>
    </Card>
  );
}
