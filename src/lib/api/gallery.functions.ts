import { createServerFn } from "@tanstack/react-start";
import { withCache } from "./cache";

const FOLDER_ID = "1VMgV3jCp1-T4iigb0975yud6BJ4yTt-Y";

type GalleryImage = {
  id: string;
  name: string;
};

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const url = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) return [];
  const html = await res.text();

  const images: GalleryImage[] = [];
  const blockRegex =
    /data-id="([a-zA-Z0-9_-]{25,})"[^>]*?aria-label="([^"]+)"/g;
  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    images.push({ id: match[1], name: match[2] });
  }

  if (images.length === 0) {
    const idRegex = /data-id="([a-zA-Z0-9_-]{25,})"/g;
    while ((match = idRegex.exec(html)) !== null) {
      images.push({ id: match[1], name: match[1] });
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
