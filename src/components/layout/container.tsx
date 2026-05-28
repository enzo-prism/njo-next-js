import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "narrow" | "prose";

const widthClasses: Record<ContainerWidth, string> = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  prose: "max-w-2xl",
};

type ContainerProps = {
  children: ReactNode;
  className?: string;
  width?: ContainerWidth;
};

export function Container({ children, className, width = "default" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", widthClasses[width], className)}>
      {children}
    </div>
  );
}
