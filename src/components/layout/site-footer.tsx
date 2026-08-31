import { ArrowRight, Mail, MessageSquareText, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import { Container } from "@/components/layout/container";
import { PrivacyChoicesButton } from "@/components/privacy-choices-button";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";

const footerLinks = [
  { href: "/michael-njo-dds", label: "Profile" },
  { href: "/dr-michael-njo-interview", label: "Interview" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink text-slate-300">
      <Container className="py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/favicon-32x32.png"
                alt=""
                width={32}
                height={32}
                className="h-9 w-9 shrink-0 object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-serif text-[15px] font-semibold text-white">Michael Njo, DDS</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  Dental Strategies
                </span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Practice transitions, valuations, growth, and leadership advisory for dentists and
              healthcare owners across the United States.
            </p>
            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <BookingButton size="sm" label="Book a call" />
              <Button asChild size="sm" variant="secondary">
                <Link
                  href={CONTACT_PATH}
                  className="inline-flex items-center"
                  data-analytics-event="contact_click"
                  data-analytics-label="Footer contact"
                >
                  <MessageSquareText className="mr-2 h-4 w-4" />
                  Contact Dr. Njo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer" className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</p>
              <div className="grid gap-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center py-1 text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Get in touch</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-11 items-center gap-2 py-1 text-sm text-slate-300 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex min-h-11 items-center gap-2 py-1 text-sm text-slate-300 transition-colors hover:text-white"
              >
                <PhoneCall className="h-4 w-4" />
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-300">© {year} Dental Strategies. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:justify-end">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center text-slate-300 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
            <PrivacyChoicesButton />
          </nav>
        </Container>
      </div>
    </footer>
  );
}
