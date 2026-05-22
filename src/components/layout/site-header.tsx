"use client";

import { ChevronDown, Mail, Menu, MessageSquareText, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

const primaryNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/michael-njo-dds", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
];

const moreNavItems: NavItem[] = [
  {
    href: "/dr-michael-njo-interview",
    label: "Interview",
    description: "Watch the full conversation with Dr. Njo.",
  },
  {
    href: "/resources",
    label: "Resources",
    description: "Book, articles, and education for owners.",
  },
];

const isActiveNav = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const isAnyMoreActive = (pathname: string) =>
  moreNavItems.some((item) => isActiveNav(pathname, item.href));

function MoreMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const closeTimer = useRef<number | undefined>(undefined);

  const moreActive = isAnyMoreActive(pathname);

  const close = useCallback(() => {
    if (typeof window !== "undefined" && closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
    setOpen(false);
  }, []);

  const cancelClose = useCallback(() => {
    if (typeof window !== "undefined" && closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  }, [cancelClose]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && closeTimer.current !== undefined) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const focusItem = (index: number) => {
    const target = itemRefs.current[index];
    target?.focus();
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(moreNavItems.length - 1));
    }
  };

  const handleItemKeyDown = (event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) => {
    const last = moreNavItems.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(index === last ? 0 : index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(index === 0 ? last : index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(last);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="site-header-more-menu"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        onFocus={cancelClose}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          moreActive || open
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )}
      >
        More
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id="site-header-more-menu"
          role="menu"
          aria-label="More links"
          className="absolute left-0 top-full z-40 mt-2 w-72 origin-top-left rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {moreNavItems.map((item, index) => {
            const active = isActiveNav(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                onClick={() => setOpen(false)}
                onKeyDown={(event) => handleItemKeyDown(event, index)}
                className={cn(
                  "group/item flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors",
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-foreground hover:bg-muted focus-visible:bg-muted",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold tracking-tight">{item.label}</span>
                  {active ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
                      Open
                    </span>
                  ) : null}
                </span>
                {item.description ? (
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src="/favicon.svg"
            alt="Dr. Michael Njo logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
            unoptimized
          />
          <span className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-foreground">Dr. Michael Njo</span>
            <span className="text-xs text-muted-foreground">Dental Strategies</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActiveNav(pathname, item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
          <MoreMenu pathname={pathname} />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground lg:flex"
            aria-label="Email contact"
          >
            <Mail className="h-3.5 w-3.5" />
            {CONTACT_EMAIL}
          </a>
          <Button asChild size="sm">
            <Link href={CONTACT_PATH} className="inline-flex items-center gap-2">
              <MessageSquareText className="h-4 w-4" />
              Contact
            </Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="md:hidden" aria-label="Open mobile menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[85%] sm:max-w-sm">
            <SheetTitle className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation and contact options for Dr. Michael Njo.
            </SheetDescription>
            <nav className="grid gap-1" aria-label="Mobile primary">
              {primaryNavItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActiveNav(pathname, item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}

              <div className="mt-4 mb-1 px-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  More
                </p>
              </div>
              {moreNavItems.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActiveNav(pathname, item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.description ? (
                      <span
                        className={cn(
                          "text-xs",
                          isActiveNav(pathname, item.href)
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.description}
                      </span>
                    ) : null}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-7 space-y-3">
              <Button asChild className="w-full">
                <Link href={CONTACT_PATH}>Contact Dr. Njo</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={CONTACT_PATH}>Use the contact form</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail className="h-4 w-4" />
                  Email: {CONTACT_EMAIL}
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${CONTACT_PHONE}`}>
                  <PhoneCall className="h-4 w-4" />
                  Call: {CONTACT_PHONE_DISPLAY}
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
