import { DEFAULT_LIMIT, LASTFM_API_KEY, LASTFM_BASE_URL } from "./constants";
import { fetchJson } from "./openWhyd";
import type { LFMTopTracksResponse, LFMTrack, TopMusic } from "./types";

function buildUrl(params: Record<string, string | number>): string {
  const query = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
    api_key: LASTFM_API_KEY,
    format: "json",
  });

  return `${LASTFM_BASE_URL}/?${query.toString()}`;
}

function getFirstImage(track: LFMTrack): string {
  return track.image?.[0]?.["#text"] ?? "";
}

export async function lastFmGetTopTracks(
  limit = DEFAULT_LIMIT,
): Promise<TopMusic[]> {
  const url = buildUrl({ method: "chart.getTopTracks", limit });
  const data = await fetchJson<LFMTopTracksResponse>(url);

  return data.tracks.track.map((track) => ({
    title: track.name,
    image: getFirstImage(track),
    id: track.url,
    isUseIdYt: false,
  }));
}

export async function lastFmGetTopTracksByCountry(
  country: string,
  limit = DEFAULT_LIMIT,
): Promise<LFMTrack[]> {
  const url = buildUrl({ method: "geo.getTopTracks", country, limit });
  const data = await fetchJson<LFMTopTracksResponse>(url);

  return data.tracks.track;
}
