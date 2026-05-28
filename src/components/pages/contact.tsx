"use client";

import { useState } from "react";
import { Mail, MessageSquareText, PhoneCall } from "lucide-react";
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

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(7, "Include a valid phone number."),
  practiceCity: z.string().min(2, "Please enter your practice city or location."),
  practiceWebsite: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service of interest."),
  message: z.string().min(10, "Share details so Dr. Njo can respond personally."),
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
};

export default function Contact() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
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
    appendFormspreeOpsMetadata(payload, "contact");

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
      router.push("/contact/success");
    } catch (err) {
      console.error(err);
      setSubmitError(`We couldn't send your message. Please try again or email ${CONTACT_EMAIL}.`);
    }
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
                  className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Mail className="h-4 w-4" />
                  </span>
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-brand"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <PhoneCall className="h-4 w-4" />
                  </span>
                  {CONTACT_PHONE_DISPLAY}
                </a>
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-brand hover:text-brand/70 lg:hidden"
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
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
                            <Input type="email" placeholder="you@email.com" {...field} />
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
                            <Input type="tel" placeholder="Phone number" {...field} />
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
                          <Input placeholder="e.g. Anaheim, CA" {...field} />
                        </FormControl>
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
                          <Input placeholder="https://yourpractice.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <FormLabel>Services you&apos;re interested in</FormLabel>
                        <FormDescription>Select the services that align with your priorities.</FormDescription>
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
                        <FormMessage />
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
                            placeholder="Share context, goals, timeline, or specific questions for Dr. Njo"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Describe your practice, priorities, and what kind of guidance you need.</FormDescription>
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
