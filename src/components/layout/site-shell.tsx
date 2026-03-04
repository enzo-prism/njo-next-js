import { type ReactNode } from "react";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10 lg:py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
