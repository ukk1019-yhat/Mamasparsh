import { createServerFn } from "@tanstack/react-start";
import { withCache } from "./cache";

const FOLDER_ID = "1VMgV3jCp1-T4iigb0975yud6BJ4yTt-Y";

type GalleryImage = {
  id: string;
  name: string;
};

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const urls = [
    `https://drive.google.com/drive/folders/${FOLDER_ID}`,
    `https://drive.google.com/drive/folders/${FOLDER_ID}?hl=en`,
  ];

  let html = "";
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      if (res.ok) {
        html = await res.text();
        if (html.length > 5000) break;
      }
    } catch {
      continue;
    }
  }
  if (!html) return [];

  const images: GalleryImage[] = [];

  const extractors = [
    // aria-label on file entries
    () => {
      const r = /data-id="([a-zA-Z0-9_-]{25,})"[^>]*?aria-label="([^"]+)"/g;
      const results: GalleryImage[] = [];
      let m;
      while ((m = r.exec(html)) !== null) results.push({ id: m[1], name: m[2] });
      return results;
    },
    // data-id + data-target="file" + nearby name span
    () => {
      const r = /data-id="([a-zA-Z0-9_-]{25,})"[^>]*?data-target="file"[^>]*?>[\s\S]*?<span[^>]*>([^<]+)<\/span>/g;
      const results: GalleryImage[] = [];
      let m;
      while ((m = r.exec(html)) !== null) results.push({ id: m[1], name: m[2].trim() });
      return results;
    },
    // bare data-id (last resort)
    () => {
      const r = /data-id="([a-zA-Z0-9_-]{25,})"/g;
      const results: GalleryImage[] = [];
      let m;
      while ((m = r.exec(html)) !== null) results.push({ id: m[1], name: m[1] });
      return results;
    },
  ];

  for (const extract of extractors) {
    const extracted = extract();
    if (extracted.length > 0) {
      images.push(...extracted);
      break;
    }
  }

  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.id)) return false;
    seen.add(img.id);
    return true;
  });
}

export const getGalleryImages = createServerFn({ method: "GET" }).handler(async () => {
  return withCache("gallery", 5 * 60 * 1000, fetchGalleryImages);
});
