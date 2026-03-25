"use client";

import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { serviceInterestOptions } from "@/data/service-interest-options";

const eventFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  practiceCity: z.string().min(2, "Please enter your practice city."),
  practiceWebsite: z.string().optional(),
  services: z
    .array(z.string())
    .min(1, "Please select at least one service of interest."),
  notes: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultValues: EventFormValues = {
  name: "",
  email: "",
  practiceCity: "",
  practiceWebsite: "",
  services: [],
  notes: "",
};

export default function PhillipsEvent() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: EventFormValues) => {
    setSubmitError(null);

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

    try {
      const res = await fetch("https://formspree.io/f/mdalbpae", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setSubmitError(
        "We couldn't send your information. Please try again or email dentalstrategies@gmail.com."
      );
    }
  };

  if (submitted) {
    return (
      <div className="space-y-8">
        <section className="mx-auto max-w-2xl space-y-6 text-center py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Thank you for connecting
          </h1>
          <p className="text-muted-foreground">
            Dr. Njo has received your information and will follow up with you
            personally. Thank you for attending today&apos;s presentation.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Visit michaelnjodds.com</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Send a direct message</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Contact form */}
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Connect with Dr. Njo</CardTitle>
            <CardDescription>
              Interested in learning more after today&apos;s presentation? Share
              your details and Dr. Njo will follow up personally with tailored
              next steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
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
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="https://yourpractice.com"
                          {...field}
                        />
                      </FormControl>
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
                      <FormLabel>
                        Services you&apos;re interested in
                      </FormLabel>
                      <FormDescription>
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
                      <FormMessage />
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
                          placeholder="Anything else you'd like Dr. Njo to know - questions, timeline, specific challenges, etc."
                          {...field}
                        />
                      </FormControl>
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
    </div>
  );
}
