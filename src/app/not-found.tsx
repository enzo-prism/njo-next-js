import type { Metadata } from "next";
import NotFoundPage from "@/components/pages/not-found";

export const metadata: Metadata = {
  title: "Page Not Found | Michael Njo, DDS",
  description: "The requested page could not be found.",
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
