"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { serviceInterestOptions } from "@/data/service-interest-options";
import { FORMSPREE_ENDPOINTS } from "@/config/form-backends";
import { CONTACT_EMAIL } from "@/config/site";
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops";
import { Container } from "@/components/layout/container";
import {
  isLeadFormRateLimited,
  LEAD_FORM_LIMITS,
  markLeadFormSubmitted,
  sharedLeadFormFields,
} from "@/lib/lead-form-validation";
import { trackAnalyticsEvent } from "@/lib/analytics-events";

const eventFormSchema = z.object({
  ...sharedLeadFormFields,
  notes: z.string().trim().max(LEAD_FORM_LIMITS.notes, "Keep your notes under 2,000 characters.").optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultValues: EventFormValues = {
  name: "",
  email: "",
  practiceCity: "",
  practiceWebsite: "",
  services: [],
  notes: "",
  privacyAcknowledged: false,
  companyWebsite: "",
};

export default function PhillipsEvent() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startedAtRef = useRef(Date.now());
  const hasTrackedStartRef = useRef(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: EventFormValues) => {
    setSubmitError(null);
    if (isLeadFormRateLimited("phillips_event")) {
      setSubmitError("Your request was already sent. Please wait a moment before submitting again.");
      return;
    }

    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("email", values.email);
    payload.append("practice_city", values.practiceCity);
    if (values.practiceWebsite) {
      payload.append("practice_website", values.practiceWebsite);
    }
    payload.append("services_interested", values.services.join(", "));
    if (values.notes) {
      payload.append("additional_notes", values.notes);
    }
    payload.append(
      "_subject",
      `Phillips Event - New contact from ${values.name}`
    );
    payload.append("_replyto", values.email);
    payload.append("privacy_acknowledged", values.privacyAcknowledged ? "yes" : "no");
    payload.append("_gotcha", values.companyWebsite);
    appendFormspreeOpsMetadata(payload, "phillips_event", startedAtRef.current);
    trackAnalyticsEvent("form_submit", { form: "phillips_event", path: window.location.pathname });

    try {
      const res = await fetch(FORMSPREE_ENDPOINTS.phillipsEvent, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      markLeadFormSubmitted("phillips_event");
      trackAnalyticsEvent("form_success", { form: "phillips_event", path: window.location.pathname });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      trackAnalyticsEvent("form_error", { form: "phillips_event", path: window.location.pathname });
      setSubmitError(
        `We couldn't send your information. Please try again or email ${CONTACT_EMAIL}.`
      );
    }
  };

  const trackFormStart = () => {
    if (hasTrackedStartRef.current) return;
    hasTrackedStartRef.current = true;
    trackAnalyticsEvent("form_start", { form: "phillips_event", path: window.location.pathname });
  };

  if (submitted) {
    return (
      <Container className="space-y-8 py-10 sm:py-14">
        <section className="mx-auto max-w-2xl space-y-6 text-center py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Thank you for connecting
          </h1>
          <p className="text-muted-foreground">
            Dr. Njo has received your information and will follow up with you
            personally. Thank you for continuing the conversation after the presentation.
          </p>
          <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
            <BookingButton />
            <Button asChild variant="outline">
              <Link href="/contact">Send a direct message</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">Visit michaelnjodds.com</Link>
            </Button>
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-10 sm:py-14">
      <section className="mx-auto max-w-3xl space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Phillips event follow-up</p>
        <h1 className="text-balance text-4xl font-semibold">Continue the conversation with Dr. Michael Njo</h1>
        <p className="text-pretty text-muted-foreground">
          For attendees of a Phillips-supported presentation and dental professionals exploring practice growth,
          valuation, or transition planning. Share your priorities below or schedule a private introductory call.
        </p>
      </section>
      {/* Contact form */}
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border border-border/70 shadow-sm">
          <CardHeader className="space-y-4">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">Connect with Dr. Njo</CardTitle>
              <CardDescription>
                Interested in learning more after the presentation? Share
                your details and Dr. Njo will follow up personally with tailored
                next steps.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Prefer to talk live? Grab a time on Dr. Njo&apos;s calendar.</p>
              <BookingButton size="sm" label="Book a 30-min call" />
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, () => {
                  trackAnalyticsEvent("form_validation_error", { form: "phillips_event", path: window.location.pathname });
                })}
                onFocusCapture={trackFormStart}
                className="space-y-5"
                noValidate
              >
                <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="phillips-company-website">Company website</label>
                  <input
                    id="phillips-company-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...form.register("companyWebsite")}
                  />
                </div>
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input autoComplete="name" maxLength={LEAD_FORM_LIMITS.name} placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">Enter your first and last name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          maxLength={LEAD_FORM_LIMITS.email}
                          placeholder="you@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Dr. Njo will use this to follow up with you directly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Practice city */}
                <FormField
                  control={form.control}
                  name="practiceCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice city or location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Anaheim, CA"
                          autoComplete="address-level2"
                          maxLength={LEAD_FORM_LIMITS.practiceCity}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="sr-only">Enter the city and state or region where your practice is located.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Practice website */}
                <FormField
                  control={form.control}
                  name="practiceWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice website (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          inputMode="url"
                          autoComplete="url"
                          maxLength={LEAD_FORM_LIMITS.practiceWebsite}
                          placeholder="https://yourpractice.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter a full domain or URL. We will add https:// if needed.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Services checkboxes */}
                <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                    <FormItem>
                      <fieldset aria-describedby="phillips-services-description phillips-services-error">
                      <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Services you&apos;re interested in
                      </legend>
                      <FormDescription id="phillips-services-description">
                        Select the services that align with your priorities.
                      </FormDescription>
                      <div className="grid gap-2 sm:grid-cols-2 pt-1">
                        {serviceInterestOptions.map((svc) => {
                          const checked =
                            form.watch("services").includes(svc);
                          return (
                            <label
                              key={svc}
                              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                                checked
                                  ? "border-primary bg-primary/5 text-foreground"
                                  : "border-border bg-background text-muted-foreground hover:border-primary/40"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="accent-primary h-4 w-4 rounded"
                                checked={checked}
                                onChange={(e) => {
                                  const current =
                                    form.getValues("services");
                                  if (e.target.checked) {
                                    form.setValue("services", [
                                      ...current,
                                      svc,
                                    ]);
                                  } else {
                                    form.setValue(
                                      "services",
                                      current.filter(
                                        (s) => s !== svc
                                      )
                                    );
                                  }
                                  form.trigger("services");
                                }}
                              />
                              {svc}
                            </label>
                          );
                        })}
                      </div>
                      <FormMessage id="phillips-services-error" />
                      </fieldset>
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          maxLength={LEAD_FORM_LIMITS.notes}
                          placeholder="Anything else you'd like Dr. Njo to know - questions, timeline, specific challenges, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Optional. Do not include patient records or other sensitive health information.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacyAcknowledged"
                  render={({ field }) => (
                    <FormItem className="rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-start gap-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            aria-label="I acknowledge the Privacy Policy and agree that Dental Strategies may use my information to respond to this request."
                            className="mt-0.5 h-5 w-5 shrink-0 rounded accent-primary"
                            checked={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormLabel className="font-normal leading-relaxed">
                          I understand that Dental Strategies will use my information to respond to this request, as described in the{" "}
                          <Link href="/privacy" className="font-medium text-brand underline underline-offset-4">Privacy Policy</Link>.
                        </FormLabel>
                      </div>
                      <FormDescription className="sr-only">Required acknowledgment for processing this request.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && (
                  <p className="text-sm text-red-500" role="status">
                    {submitError}
                  </p>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:items-center pt-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {form.formState.isSubmitting
                      ? "Submitting..."
                      : "Request a follow-up"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
