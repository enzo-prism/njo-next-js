import { ArrowRight, Mail, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
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
    <footer className="mt-16 border-t border-border bg-slate-950 text-slate-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="text-sm font-semibold text-white">Michael Njo, DDS</p>
          <p className="text-sm text-slate-300">
            Dental consulting, transitions, and leadership support for healthcare and dental practices across the U.S.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
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

        <nav aria-label="Footer" className="grid gap-2 sm:grid-cols-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-slate-300">
          <p>Questions?</p>
          <p className="mt-2">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2">
            <a href={`tel:${CONTACT_PHONE}`} className="hover:text-white">
              {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
        © {year} Dental Strategies. All rights reserved.
      </p>
    </footer>
  );
}
