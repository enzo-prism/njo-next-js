"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceInterestOptions } from "@/data/service-interest-options";

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

    try {
      const res = await fetch("https://formspree.io/f/manaywyw", {
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
      setSubmitError("We couldn't send your message. Please try again or email dentalstrategies@gmail.com.");
    }
  };

  return (
    <>
      <div className="space-y-8">
        <section className="space-y-3 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Send a message to Dr. Michael Njo</h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            Share a message directly with Dr. Michael Njo. Let him know about your practice, goals, or questions and he’ll
            personally reach out with next steps.
          </p>
        </section>

        <Card className="border border-border/70 shadow-sm">
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
                        <FormDescription>Used for reply confirmation and scheduling.</FormDescription>
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

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:items-center">
                  <Button variant="outline" asChild>
                    <Link href="/">Back to home</Link>
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Send message to Dr. Njo
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
