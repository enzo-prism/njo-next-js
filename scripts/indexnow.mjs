#!/usr/bin/env node
/**
 * Submit the live sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver and
 * other participating engines; Bing results also feed Copilot and ChatGPT
 * search). Run manually AFTER a production deploy that changed content:
 *
 *   npm run indexnow            # every sitemap URL
 *   npm run indexnow -- /books /resources/second-book   # only these paths
 *
 * The key file lives at public/<key>.txt and must stay deployed.
 */
const HOST = "michaelnjodds.com";
const KEY = "cf81343d2483d591bcc4d1c4b4d9ce64";
const ORIGIN = `https://${HOST}`;

const paths = process.argv.slice(2);
let urlList;
if (paths.length) {
  urlList = paths.map((p) => new URL(p, ORIGIN).toString());
} else {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}
if (!urlList.length) throw new Error("No URLs to submit");

const keyRes = await fetch(`${ORIGIN}/${KEY}.txt`);
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  throw new Error("IndexNow key file is not live yet; deploy first.");
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
if (res.status >= 400) process.exitCode = 1;
