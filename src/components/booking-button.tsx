import { CalendarCheck } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { BOOKING_URL } from "@/config/site";

type BookingButtonProps = {
  href?: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  showIcon?: boolean;
};

export function BookingButton({
  href = BOOKING_URL,
  label = "Book a call",
  variant = "default",
  size,
  className,
  showIcon = true,
}: BookingButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {showIcon ? <CalendarCheck className="h-4 w-4" /> : null}
        {label}
      </a>
    </Button>
  );
}
