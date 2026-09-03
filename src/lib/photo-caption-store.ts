const CACHE_KEY = "njo-photo-captions";
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 365;

export type PhotoCaptionRecord = {
  caption: string;
  savedAt: string;
};

export type PhotoCaptionMap = Record<string, PhotoCaptionRecord>;

type GlobalCaptionStore = typeof globalThis & {
  __njoPhotoCaptions?: PhotoCaptionMap;
};

export type PhotoCaptionCache = {
  get(): Promise<PhotoCaptionMap | null>;
  set(map: PhotoCaptionMap): Promise<void>;
};

let testCache: PhotoCaptionCache | null = null;

export function setPhotoCaptionCacheForTests(cache: PhotoCaptionCache | null) {
  testCache = cache;
}

export function resetPhotoCaptionMemoryForTests() {
  delete (globalThis as GlobalCaptionStore).__njoPhotoCaptions;
}

export function applyLiveCaptionEdit(
  map: PhotoCaptionMap,
  id: string,
  caption: string,
  savedAt: string,
): { map: PhotoCaptionMap; record: PhotoCaptionRecord | null } {
  const next: PhotoCaptionMap = { ...map };
  const trimmed = caption.trim();
  if (!trimmed) {
    delete next[id];
    return { map: next, record: null };
  }
  const record: PhotoCaptionRecord = {
    caption: trimmed,
    savedAt,
  };
  next[id] = record;
  return { map: next, record };
}

function memoryStore(): PhotoCaptionMap {
  const globalStore = globalThis as GlobalCaptionStore;
  if (!globalStore.__njoPhotoCaptions) {
    globalStore.__njoPhotoCaptions = {};
  }
  return globalStore.__njoPhotoCaptions;
}

function replaceMemory(map: PhotoCaptionMap): PhotoCaptionMap {
  (globalThis as GlobalCaptionStore).__njoPhotoCaptions = { ...map };
  return memoryStore();
}

async function vercelCache(): Promise<PhotoCaptionCache> {
  const { getCache } = await import("@vercel/functions");
  const cache = getCache({ namespace: "njo-photo-captions" });
  return {
    async get() {
      const cached = await cache.get(CACHE_KEY);
      if (cached && typeof cached === "object") {
        return cached as PhotoCaptionMap;
      }
      return null;
    },
    async set(map) {
      await cache.set(CACHE_KEY, map, {
        ttl: CACHE_TTL_SECONDS,
        tags: ["njo-photo-captions"],
        name: "njo-photo-captions",
      });
    },
  };
}

async function activeCache(): Promise<PhotoCaptionCache | null> {
  if (testCache) {
    return testCache;
  }
  try {
    return await vercelCache();
  } catch {
    return null;
  }
}

export async function loadLiveCaptionMap(): Promise<PhotoCaptionMap> {
  const cache = await activeCache();
  if (!cache) {
    return memoryStore();
  }
  try {
    const cached = await cache.get();
    if (cached) {
      return replaceMemory(cached);
    }
  } catch {
    return memoryStore();
  }
  return memoryStore();
}

export async function saveLiveCaption(
  id: string,
  caption: string,
): Promise<PhotoCaptionRecord | null> {
  const current = await loadLiveCaptionMap();
  const { map, record } = applyLiveCaptionEdit(
    current,
    id,
    caption,
    new Date().toISOString(),
  );
  replaceMemory(map);
  const cache = await activeCache();
  if (cache) {
    try {
      await cache.set(map);
    } catch {
      // Local Next.js keeps the in-memory map when Runtime Cache is unavailable.
    }
  }
  return record;
}
