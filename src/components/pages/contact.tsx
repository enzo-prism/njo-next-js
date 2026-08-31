"use client";

import { useRef, useState } from "react";
import { Mail, MessageSquareText, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookingButton } from "@/components/booking-button";
import { DsoPricingCallout } from "@/components/dso-pricing-callout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { serviceInterestOptions } from "@/data/service-interest-options";
import { FORMSPREE_ENDPOINTS } from "@/config/form-backends";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/config/site";
import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops";
import { CONTACT_FORM_LEAD_PARAMS, recordFormLead } from "@/lib/ga4";
import {
  isLeadFormRateLimited,
  LEAD_FORM_LIMITS,
  markLeadFormSubmitted,
  sharedLeadFormFields,
} from "@/lib/lead-form-validation";
import { trackAnalyticsEvent } from "@/lib/analytics-events";

const contactSchema = z.object({
  ...sharedLeadFormFields,
  phone: z
    .string()
    .trim()
    .min(7, "Include a valid phone number.")
    .max(LEAD_FORM_LIMITS.phone, "Keep the phone number under 40 characters.")
    .regex(/^[+().\s\d-]+$/, "Use only numbers and standard phone punctuation."),
  message: z
    .string()
    .trim()
    .min(10, "Share details so Dr. Njo can respond personally.")
    .max(LEAD_FORM_LIMITS.message, "Keep your message under 5,000 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  practiceCity: "",
  practiceWebsite: "",
  services: [],
  message: "",
  privacyAcknowledged: false,
  companyWebsite: "",
};

export default function Contact() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedAtRef = useRef(Date.now());
  const hasTrackedStartRef = useRef(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    if (isLeadFormRateLimited("contact")) {
      setSubmitError("Your message was already sent. Please wait a moment before submitting again.");
      return;
    }

    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("email", values.email);
    payload.append("phone", values.phone);
    payload.append("practice_city", values.practiceCity);
    if (values.practiceWebsite) {
      payload.append("practice_website", values.practiceWebsite);
    }
    payload.append("services_interested", values.services.join(", "));
    payload.append("message", values.message);
    payload.append("_subject", "New inquiry for Michael Njo, DDS");
    payload.append("_replyto", values.email);
    payload.append("privacy_acknowledged", values.privacyAcknowledged ? "yes" : "no");
    payload.append("_gotcha", values.companyWebsite);
    appendFormspreeOpsMetadata(payload, "contact", startedAtRef.current);
    trackAnalyticsEvent("form_submit", { form: "contact", path: window.location.pathname });

    try {
      const res = await fetch(FORMSPREE_ENDPOINTS.contact, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      markLeadFormSubmitted("contact");
      trackAnalyticsEvent("form_success", { form: "contact", path: window.location.pathname });
      recordFormLead(CONTACT_FORM_LEAD_PARAMS);
      router.push("/contact/success");
    } catch (err) {
      console.error(err);
      trackAnalyticsEvent("form_error", { form: "contact", path: window.location.pathname });
      setSubmitError(`We couldn't send your message. Please try again or email ${CONTACT_EMAIL}.`);
    }
  };

  const trackFormStart = () => {
    if (hasTrackedStartRef.current) return;
    hasTrackedStartRef.current = true;
    trackAnalyticsEvent("form_start", { form: "contact", path: window.location.pathname });
  };

  return (
    <>
      <Section spacing="none" className="pt-10 pb-14 sm:pt-14 sm:pb-20">
        <SectionHeading
          eyebrow="Contact"
          as="h1"
          title="Send a message to Dr. Michael Njo"
          description="Tell Dr. Njo about your practice, goals, or questions and he'll personally reach out with next steps. Book a call, or use the form, email, or phone below."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Contact options */}
          <aside className="space-y-6">
            <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold text-foreground">Book a call</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The fastest way to get started — grab 30 minutes on Dr. Njo&apos;s calendar.
                </p>
                <BookingButton className="w-full sm:w-auto" />
              </div>

              <div className="space-y-3 border-t border-border/60 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Or reach out directly
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex min-h-11 items-center gap-3 text-sm text-foreground transition-colors hover:text-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Mail className="h-4 w-4" />
                  </span>
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex min-h-11 items-center gap-3 text-sm text-foreground transition-colors hover:text-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <PhoneCall className="h-4 w-4" />
                  </span>
                  {CONTACT_PHONE_DISPLAY}
                </a>
                <a
                  href="#contact-form"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/70 lg:hidden"
                >
                  <MessageSquareText className="h-4 w-4" />
                  Jump to the form
                </a>
              </div>
            </div>

            <p className="rounded-2xl bg-surface px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              Dr. Njo reviews every inquiry personally and typically responds within two business days.
            </p>
          </aside>

          {/* Form */}
          <Card id="contact-form" className="scroll-mt-28 border border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Start a conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, () => {
                    trackAnalyticsEvent("form_validation_error", { form: "contact", path: window.location.pathname });
                  })}
                  onFocusCapture={trackFormStart}
                  className="space-y-6"
                  noValidate
                >
                  <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="contact-company-website">Company website</label>
                    <input
                      id="contact-company-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...form.register("companyWebsite")}
                    />
                  </div>
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

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" inputMode="email" autoComplete="email" maxLength={LEAD_FORM_LIMITS.email} placeholder="you@email.com" {...field} />
                          </FormControl>
                          <FormDescription>Used for reply confirmation and follow-up.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" inputMode="tel" autoComplete="tel" maxLength={LEAD_FORM_LIMITS.phone} placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormDescription>Mobile preferred. Include country code if outside the US.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="practiceCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice city or location</FormLabel>
                        <FormControl>
                          <Input autoComplete="address-level2" maxLength={LEAD_FORM_LIMITS.practiceCity} placeholder="e.g. Anaheim, CA" {...field} />
                        </FormControl>
                        <FormDescription className="sr-only">Enter the city and state or region where your practice is located.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="practiceWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice website (optional)</FormLabel>
                        <FormControl>
                          <Input type="url" inputMode="url" autoComplete="url" maxLength={LEAD_FORM_LIMITS.practiceWebsite} placeholder="https://yourpractice.com" {...field} />
                        </FormControl>
                        <FormDescription>Enter a full domain or URL. We will add https:// if needed.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <fieldset aria-describedby="contact-services-description contact-services-error">
                        <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Services you&apos;re interested in</legend>
                        <FormDescription id="contact-services-description">Select the services that align with your priorities.</FormDescription>
                        <div className="grid gap-2 pt-1 sm:grid-cols-2">
                          {serviceInterestOptions.map((svc) => {
                            const checked = form.watch("services").includes(svc);
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
                                  className="h-4 w-4 rounded accent-primary"
                                  checked={checked}
                                  onChange={(event) => {
                                    const current = form.getValues("services");
                                    if (event.target.checked) {
                                      form.setValue("services", [...current, svc]);
                                    } else {
                                      form.setValue(
                                        "services",
                                        current.filter((service) => service !== svc),
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
                        <FormMessage id="contact-services-error" />
                        </fieldset>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            maxLength={LEAD_FORM_LIMITS.message}
                            placeholder="Share context, goals, timeline, or specific questions for Dr. Njo"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Describe your practice, priorities, and what kind of guidance you need.</FormDescription>
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
                              aria-label="I acknowledge the Privacy Policy and agree that Dental Strategies may use my information to respond to this inquiry."
                              className="mt-0.5 h-5 w-5 shrink-0 rounded accent-primary"
                              checked={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormLabel className="font-normal leading-relaxed">
                            I understand that Dental Strategies will use my information to respond to this inquiry, as described in the{" "}
                            <Link href="/privacy" className="font-medium text-brand underline underline-offset-4">Privacy Policy</Link>.
                          </FormLabel>
                        </div>
                        <FormDescription className="sr-only">Required acknowledgment for processing this inquiry.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <p className="text-sm text-red-500" role="status">
                      {submitError}
                    </p>
                  )}

                  <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                    {form.formState.isSubmitting ? "Sending…" : "Send message to Dr. Njo"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section spacing="none" className="pb-16">
        <DsoPricingCallout />
      </Section>
    </>
  );
}
