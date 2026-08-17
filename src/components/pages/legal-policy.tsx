import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CONTACT_EMAIL } from "@/config/site";

type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type LegalPolicyProps = {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: PolicySection[];
};

export function LegalPolicy({ eyebrow, title, summary, effectiveDate, sections }: LegalPolicyProps) {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{summary}</p>
          <p className="mt-4 text-sm text-muted-foreground">Effective {effectiveDate}</p>
        </header>

        <div className="space-y-9 py-9">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground marker:text-brand">
                  {section.items.map((item) => (
                    <li key={item} className="pl-1 leading-7">{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <footer className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Questions about these terms?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Email <a className="font-medium text-brand underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            {" "}or use the <Link className="font-medium text-brand underline underline-offset-4" href="/contact">contact form</Link>.
          </p>
        </footer>
      </article>
    </Container>
  );
}
