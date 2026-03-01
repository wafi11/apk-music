import { DEFAULT_HEADERS_YT_MUSIC, YT_MUSIC_API_URL } from "./constants";
import type { ApiResponse, YtMusicResponse } from "./types";

export async function downloadYtMusic(link: string): Promise<YtMusicResponse> {
  const body = new URLSearchParams({
    domain: "api-ak.vidssave.com",
    origin: "source",
    auth: "20250901majwlqo",
    link,
  });

  const res = await fetch(YT_MUSIC_API_URL, {
    method: "POST",
    headers: DEFAULT_HEADERS_YT_MUSIC,
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`vidssave API responded with status ${res.status}`);
  }

  const text = await res.text();
  if (!text) {
    throw new Error("Empty response from vidssave");
  }

  const result = JSON.parse(text) as ApiResponse;

  return result.data;
}
