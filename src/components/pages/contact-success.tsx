import { CheckCircle2, Mail, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";

export default function ContactSuccess() {
  return (
    <>
      <div className="mx-auto flex min-h-[55vh] max-w-3xl items-center">
        <Card className="w-full border border-border/80 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-3xl">Thank you for reaching out</CardTitle>
            <CardDescription className="mx-auto max-w-2xl">
              Your message is on its way. Dr. Michael Njo (Michael Njo, DDS) reviews every inquiry personally and will respond
              within two business days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              If this is a high-priority transition timing or legal matter, you can still email directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline">
                <Mail className="h-3.5 w-3.5" />
                {CONTACT_EMAIL}
              </a>{" "}
              or call{" "}
              <a href={`tel:${CONTACT_PHONE}`} className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline">
                <PhoneCall className="h-3.5 w-3.5" />
                {CONTACT_PHONE_DISPLAY}
              </a>{" "}
              for urgent follow-up.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="sm:w-fit">
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-fit">
                <Link href="/contact">Send another message</Link>
              </Button>
              <Button asChild variant="secondary" className="sm:w-fit">
                <Link href="/resources">Browse resources</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
