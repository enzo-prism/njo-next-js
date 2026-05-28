import { ArrowRight, Mail, MessageSquareText, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import { Container } from "@/components/layout/container";
import { CONTACT_EMAIL, CONTACT_PATH, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";

const footerLinks = [
  { href: "/michael-njo-dds", label: "Profile" },
  { href: "/dr-michael-njo-interview", label: "Interview" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
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
                src="/favicon.svg"
                alt="Dr. Michael Njo logo"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 object-contain"
                unoptimized
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
                <Link href={CONTACT_PATH} className="inline-flex items-center">
                  <MessageSquareText className="mr-2 h-4 w-4" />
                  Contact Dr. Njo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer" className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</p>
              <div className="grid gap-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Get in touch</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
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
          <p className="text-xs text-slate-500">© {year} Dental Strategies. All rights reserved.</p>
          <p className="text-xs text-slate-500">Michael Njo, DDS · michaelnjodds.com</p>
        </Container>
      </div>
    </footer>
  );
}
