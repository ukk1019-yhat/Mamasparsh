import { createServerFn } from "@tanstack/react-start";
import { withCache } from "./cache";

const FOLDER_ID = "1VMgV3jCp1-T4iigb0975yud6BJ4yTt-Y";

type GalleryImage = {
  id: string;
  name: string;
};

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const url = `https://drive.google.com/drive/folders/${FOLDER_ID}?hl=en`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();
  const ids: GalleryImage[] = [];
  const regex = /data-id="([a-zA-Z0-9_-]{25,})"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    ids.push({ id: match[1], name: match[1] });
  }
  const seen = new Set<string>();
  return ids.filter((img) => {
    if (seen.has(img.id)) return false;
    seen.add(img.id);
    return true;
  });
}

export const getGalleryImages = createServerFn({ method: "GET" }).handler(async () => {
  return withCache("gallery", 5 * 60 * 1000, fetchGalleryImages);
});
