import Link from "next/link";

export function AuthorityResources() {
  return <section aria-labelledby="published-work-heading" className="mx-auto max-w-5xl space-y-5 px-4 py-12 sm:px-6">
    <h2 id="published-work-heading" className="font-serif text-2xl font-semibold">Published work and professional perspective</h2>
    <p className="max-w-3xl leading-relaxed text-muted-foreground">Dr. Njo brings more than two decades of advising practice owners to his writing and interviews. Explore his own guidance alongside independently published conversations about his work.</p>
    <ul className="grid gap-4 sm:grid-cols-2">
      <li><Link className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4" href="/books">Dental Practice Transitions Handbook: compare editions</Link><p className="text-sm text-muted-foreground">Authored by Michael A. Njo, DDS; the expanded second edition launches November 17, 2026.</p></li>
      <li><a className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4" href="https://dentallifestylesmagazine.com/beyond-brokerage-dr-michael-njos-whole-person-approach-to-dental-practice-transitions/">Read Dr. Glenn Vo’s Dental Lifestyles interview</a><p className="text-sm text-muted-foreground">An independently published conversation about Dr. Njo’s approach to practice transitions.</p></li>
      <li><Link className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4" href="/navigating-dental-insurance-podcast">Listen to The Navigating Dental Insurance Podcast</Link><p className="text-sm text-muted-foreground">Dr. Njo joins Ben Tuinei and Jordon Comstock to discuss decisions facing practice owners.</p></li>
      <li><a className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4" href="https://practicetransitionsinstitute.com/services/selling-to-a-dso">Bring a DSO offer to PTI for review</a><p className="text-sm text-muted-foreground">Connect educational material to a review of the business terms and your transition goals.</p></li>
    </ul>
  </section>;
}
