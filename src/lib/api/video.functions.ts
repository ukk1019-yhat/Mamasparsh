import { createServerFn } from "@tanstack/react-start";

const FOLDER_ID = "1Vc41YaVAPcLC2FpC7zgm4GhHp67NrC3E";

export type VideoItem = {
  id: string;
};

export const getVideos = createServerFn({ method: "GET" }).handler(async () => {
  const url = `https://drive.google.com/drive/folders/${FOLDER_ID}?hl=en`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();
  const ids: VideoItem[] = [];
  const regex = /data-id="([a-zA-Z0-9_-]{25,})"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    ids.push({ id: match[1] });
  }
  const seen = new Set<string>();
  const unique = ids.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
  return unique;
});
