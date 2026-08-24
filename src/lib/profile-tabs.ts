export type ProfileTab = "overview" | "news";

const newsSectionIds = new Set([
  "beyond-the-chair-anaheim",
  "panel-of-experts-dinner",
  "industry-leaders",
  "upcoming-events",
  "past-events",
]);

export function resolveProfileTab(search: string, hash: string): ProfileTab {
  const queryTab = new URLSearchParams(search).get("tab");
  const hashId = hash.replace(/^#/, "");
  return queryTab === "news" || newsSectionIds.has(hashId) ? "news" : "overview";
}

export function buildProfileTabPath({
  pathname,
  search,
  hash,
  tab,
}: {
  pathname: string;
  search: string;
  hash: string;
  tab: ProfileTab;
}): string {
  const params = new URLSearchParams(search);
  let nextHash = hash;

  if (tab === "news") {
    params.set("tab", "news");
    if (!newsSectionIds.has(hash.replace(/^#/, ""))) nextHash = "";
  } else {
    params.delete("tab");
    nextHash = "";
  }

  const nextSearch = params.toString();
  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${nextHash}`;
}
