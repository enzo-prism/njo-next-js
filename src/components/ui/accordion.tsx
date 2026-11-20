"use client"

/**
 * Accordion built on native <details>/<summary>.
 *
 * Radix Accordion (1.x) does not render a closed item's content at all, so FAQ
 * answers and interview notes were missing from the server HTML that search and
 * AI crawlers read (they existed only in JSON-LD). Native disclosure keeps every
 * answer in the HTML, works without JavaScript, and is keyboard accessible.
 * Items in one Accordion share a `name`, so opening one closes the others
 * (single-open behaviour, like the old `type="single" collapsible`).
 */
import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const AccordionGroupContext = React.createContext<string | undefined>(undefined)

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Kept for API compatibility with the Radix version; behaviour is always single + collapsible. */
  type?: "single" | "multiple"
  collapsible?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", ...rest }, ref) => {
    const { collapsible, ...props } = rest
    void collapsible
    const id = React.useId()
    return (
      <AccordionGroupContext.Provider value={type === "single" ? `accordion-${id}` : undefined}>
        <div ref={ref} {...props} />
      </AccordionGroupContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

type AccordionItemProps = React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  /** Kept for API compatibility; native details need no item value. */
  value?: string
}

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, ...rest }, ref) => {
    const { value, ...props } = rest
    void value
    const name = React.useContext(AccordionGroupContext)
    return <details ref={ref} name={name} className={cn("group border-b", className)} {...props} />
  }
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <summary
    ref={ref}
    className={cn(
      "flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden",
      className
    )}
    {...props}
  >
    <h3 className="flex-1 text-[inherit] font-[inherit] leading-[inherit]">{children}</h3>
    <ChevronDown
      className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
      aria-hidden="true"
    />
  </summary>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className="overflow-hidden text-sm" {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </div>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
