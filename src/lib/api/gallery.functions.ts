import { createServerFn } from "@tanstack/react-start";

const FOLDER_ID = "1VMgV3jCp1-T4iigb0975yud6BJ4yTt-Y";

type GalleryImage = {
  id: string;
  name: string;
};

export const getGalleryImages = createServerFn({ method: "GET" }).handler(async () => {
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
  const unique = ids.filter((img) => {
    if (seen.has(img.id)) return false;
    seen.add(img.id);
    return true;
  });
  return unique;
});
