"use client";

import { Mail, Menu, MessageSquareText, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import { Container } from "@/components/layout/container";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/michael-njo-dds", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  {
    href: "/resources",
    label: "Resources",
    description: "Books, articles, and education for owners.",
  },
  {
    href: "/dr-michael-njo-interview",
    label: "Interview",
    description: "Watch the full conversation with Dr. Njo.",
  },
];

const isActiveNav = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function SiteHeader() {
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/favicon-32x32.png"
            alt=""
            width={32}
            height={32}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[15px] font-semibold tracking-tight text-foreground">
              Dr. Michael Njo
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Dental Strategies
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActiveNav(pathname, item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm" variant="ghost">
            <Link
              href={CONTACT_PATH}
              className="inline-flex items-center gap-2"
              data-analytics-event="contact_click"
              data-analytics-label="Header contact"
            >
              <MessageSquareText className="h-4 w-4" />
              Contact
            </Link>
          </Button>
          <BookingButton label="Book a call" size="sm" />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open mobile menu">
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
              {navItems.map((item) => (
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

            </nav>
            <div className="mt-7 space-y-3">
              <BookingButton className="w-full" />
              <Button asChild variant="outline" className="w-full">
                <Link
                  href={CONTACT_PATH}
                  data-analytics-event="contact_click"
                  data-analytics-label="Mobile menu contact"
                >
                  <MessageSquareText className="h-4 w-4" />
                  Contact Dr. Njo
                </Link>
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
      </Container>
    </header>
  );
}
