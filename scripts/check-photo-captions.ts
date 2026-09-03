import assert from "node:assert/strict";

import {
  applyLiveCaptionEdit,
  loadLiveCaptionMap,
  resetPhotoCaptionMemoryForTests,
  saveLiveCaption,
  setPhotoCaptionCacheForTests,
  type PhotoCaptionMap,
} from "@/lib/photo-caption-store";

function createDurableCache(initial: PhotoCaptionMap = {}) {
  let stored: PhotoCaptionMap | null = { ...initial };
  return {
    cache: {
      async get() {
        return stored ? { ...stored } : null;
      },
      async set(map: PhotoCaptionMap) {
        stored = { ...map };
      },
    },
  };
}

async function main() {
  const savedAt = "2026-09-03T01:40:00.000Z";

  const created = applyLiveCaptionEdit(
    {},
    "office-strategy-group",
    "First save",
    savedAt,
  );
  assert.equal(created.record?.caption, "First save");
  assert.equal(created.map["office-strategy-group"]?.caption, "First save");

  const edited = applyLiveCaptionEdit(
    created.map,
    "office-strategy-group",
    "  Corrected caption  ",
    savedAt,
  );
  assert.equal(edited.record?.caption, "Corrected caption");
  assert.equal(edited.map["office-strategy-group"]?.caption, "Corrected caption");

  const second = applyLiveCaptionEdit(
    edited.map,
    "black-tie-medal-portrait",
    "Dr. Michael Njo with Dr. Allen Budenz.",
    savedAt,
  );
  assert.equal(second.map["office-strategy-group"]?.caption, "Corrected caption");
  assert.equal(
    second.map["black-tie-medal-portrait"]?.caption,
    "Dr. Michael Njo with Dr. Allen Budenz.",
  );

  const unpublished = applyLiveCaptionEdit(
    second.map,
    "black-tie-medal-portrait",
    "   ",
    savedAt,
  );
  assert.equal(unpublished.record, null);
  assert.equal(unpublished.map["black-tie-medal-portrait"], undefined);
  assert.equal(
    unpublished.map["office-strategy-group"]?.caption,
    "Corrected caption",
  );

  const durable = createDurableCache();
  setPhotoCaptionCacheForTests(durable.cache);
  resetPhotoCaptionMemoryForTests();

  const saved = await saveLiveCaption(
    "office-strategy-group",
    "On the board of an AI startup (in stealth mode).",
  );
  assert.equal(
    saved?.caption,
    "On the board of an AI startup (in stealth mode).",
  );
  assert.ok(saved?.savedAt);

  resetPhotoCaptionMemoryForTests();
  const reloaded = await loadLiveCaptionMap();
  assert.equal(
    reloaded["office-strategy-group"]?.caption,
    "On the board of an AI startup (in stealth mode).",
  );

  const updated = await saveLiveCaption(
    "office-strategy-group",
    "On the board of an AI startup (in stealth mode): reviewed.",
  );
  assert.equal(
    updated?.caption,
    "On the board of an AI startup (in stealth mode): reviewed.",
  );

  resetPhotoCaptionMemoryForTests();
  const reloadedEdit = await loadLiveCaptionMap();
  assert.equal(
    reloadedEdit["office-strategy-group"]?.caption,
    "On the board of an AI startup (in stealth mode): reviewed.",
  );

  await saveLiveCaption(
    "black-tie-medal-portrait",
    "Dr. Michael Njo with Dr. Allen Budenz.",
  );
  resetPhotoCaptionMemoryForTests();
  const both = await loadLiveCaptionMap();
  assert.equal(
    Object.keys(both).sort().join(","),
    "black-tie-medal-portrait,office-strategy-group",
  );

  await saveLiveCaption("black-tie-medal-portrait", "");
  resetPhotoCaptionMemoryForTests();
  const afterUnpublish = await loadLiveCaptionMap();
  assert.equal(afterUnpublish["black-tie-medal-portrait"], undefined);
  assert.equal(
    afterUnpublish["office-strategy-group"]?.caption,
    "On the board of an AI startup (in stealth mode): reviewed.",
  );

  setPhotoCaptionCacheForTests(null);
  resetPhotoCaptionMemoryForTests();

  console.log("Photo caption save assertions passed.");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
