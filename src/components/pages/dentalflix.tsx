import Link from "next/link";
import { ArrowRight, BadgePercent, CalendarCheck2, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT_PATH } from "@/config/site";
import { Container } from "@/components/layout/container";

export default function DentalflixPage() {
  const redemptionPhrase = "I heard about Michael from the DentalFlix event.";
  const claimSteps = [
    "Book a 30-minute call with Dr. Njo, or reach out through the contact page, email, or phone.",
    `Mention this exact line: "${redemptionPhrase}"`,
    "Your $500 DentalFlix discount is applied to consultations and advisory services.",
  ];

  return (
    <Container className="space-y-8 py-10 sm:py-14">
      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge variant="secondary" className="mb-3 inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  DentalFlix Exclusive
                </Badge>
                <CardTitle className="text-4xl">$500 Off With Dr. Michael Njo</CardTitle>
              </div>
              <Badge className="w-fit">Valid for DentalFlix referrals</Badge>
            </div>
            <CardDescription>
              View this offer before your next transition or leadership planning conversation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you mention the DentalFlix line, Dr. Njo will apply a direct discount to your first services.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>How to redeem</CardTitle>
            <CardDescription>Use this 3-step flow to secure the savings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {claimSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3"
              >
                <Badge>{index + 1}</Badge>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <BookingButton label="Book your call" />
              <Button asChild variant="outline">
                <Link href={CONTACT_PATH} className="inline-flex items-center gap-2">
                  Use the contact page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5" />
              What to say
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="rounded-lg bg-slate-900 px-4 py-5 text-sm font-semibold leading-relaxed text-white">
              “{redemptionPhrase}”
            </p>
            <p className="text-sm text-muted-foreground">
              Mention this phrase when contacting Dr. Njo to receive the DentalFlix discount.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              Keep notes of practice goals for a faster quote.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Ready to move forward?</CardTitle>
            <CardDescription>
              Contact Dr. Njo and include the DentalFlix reference at first touch.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-3">
            <BookingButton />
            <Button asChild variant="outline" className="inline-flex items-center gap-2">
              <Link href={CONTACT_PATH}>
                <BadgePercent className="h-4 w-4" />
                Contact Dr. Njo
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/michael-njo-dds">Learn more about Dr. Njo</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </Container>
  );
}
