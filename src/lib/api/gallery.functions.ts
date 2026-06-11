import { createServerFn } from "@tanstack/react-start";
import { withCache } from "./cache";
import { listFolderFiles } from "./drive";

const FOLDER_ID = "1VMgV3jCp1-T4iigb0975yud6BJ4yTt-Y";

type GalleryImage = {
  id: string;
  name: string;
};

async function scrapeFolder(): Promise<GalleryImage[]> {
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

  const r =
    /tr[^>]*?data-id="([a-zA-Z0-9_-]{25,})"[^>]*?>[\s\S]*?JxSEve[^>]*?aria-label="([^"]+)"/g;
  let m;
  while ((m = r.exec(html)) !== null) {
    const name = m[2].replace(/\s+(?:Image|Document|Video|Folder|PDF)\s+Shared$/, "");
    images.push({ id: m[1], name });
  }

  if (images.length === 0) {
    const fallbackR = /data-id="([a-zA-Z0-9_-]{25,})"/g;
    while ((m = fallbackR.exec(html)) !== null) {
      images.push({ id: m[1], name: m[1] });
    }
  }

  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.id)) return false;
    seen.add(img.id);
    return true;
  });
}

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  if (refreshToken) {
    try {
      return await listFolderFiles(refreshToken);
    } catch {
      return scrapeFolder();
    }
  }

  return scrapeFolder();
}

export const getGalleryImages = createServerFn({ method: "GET" }).handler(async () => {
  return withCache("gallery", 5 * 60 * 1000, fetchGalleryImages);
});
