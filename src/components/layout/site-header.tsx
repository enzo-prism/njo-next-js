"use client";

import { Mail, Menu, MessageSquareText, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/michael-njo-dds", label: "About" },
  { href: "/dr-michael-njo-interview", label: "Interview" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/resources", label: "Resources" },
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
          {navItems.map((item) => (
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
            <nav className="grid gap-3" aria-label="Mobile primary">
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
