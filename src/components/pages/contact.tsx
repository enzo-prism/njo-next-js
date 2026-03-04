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

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(7, "Include a valid phone number."),
  organization: z.string().optional(),
  message: z.string().min(10, "Share details so Dr. Njo can respond personally."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  organization: "",
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
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        payload.append(key, value as string);
      }
    });
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
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice / Organization (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Practice name" {...field} />
                      </FormControl>
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
                        <Textarea rows={6} placeholder="Share context, goals, or specific questions for Dr. Njo" {...field} />
                      </FormControl>
                      <FormDescription>Describe your timeline, practice type, and immediate priorities.</FormDescription>
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
