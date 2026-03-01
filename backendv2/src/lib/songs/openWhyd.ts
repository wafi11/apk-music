import { DEFAULT_HEADERS, OPENWHYD_URL } from "./constants";
import type { HotResponse, SearchResponse, TopMusic } from "./types";

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!res.ok) {
    throw new Error(`OpenWhyd responded with status ${res.status}`);
  }

  const text = await res.json();
  if (!text) {
    throw new Error("Empty response from OpenWhyd");
  }

  return text as T;
}

export async function opendWhydSearchTracks(
  query: string,
  limit = 10,
): Promise<SearchResponse> {
  const encoded = encodeURIComponent(query);
  return fetchJson<SearchResponse>(
    `${OPENWHYD_URL}/search?q=${encoded}&limit=${limit}&format=json`,
  );
}

export async function openWhydGetTrending(): Promise<TopMusic[]> {
  const data = await fetchJson<HotResponse>(`${OPENWHYD_URL}/hot?format=json`);

  return data.tracks.map((track) => ({
    title: track.name,
    image: track.img ?? "",
    id: track.eId?.split("/yt/")[1] ?? track.eId ?? "",
    isUseIdYt: track.eId?.startsWith("/yt/") ?? false,
  }));
}
