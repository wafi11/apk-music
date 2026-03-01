import { DEEZER_BASE_URL, DEFAULT_LIMIT } from "./constants";
import { fetchJson } from "./openWhyd";
import type { DeezerChartResponse, DeezerTrack, TopMusic } from "./types";

export async function deeZeerGetTopTracks(
  limit = DEFAULT_LIMIT,
): Promise<TopMusic[]> {
  const data = await fetchJson<DeezerChartResponse>(
    `${DEEZER_BASE_URL}/chart/0/tracks?limit=${limit}`,
  );

  return data.data.map((track) => ({
    title: track.title,
    image: track.artist.picture,
    id: track.preview,
    isUseIdYt: false,
  }));
}

export async function deeZerGetTopTracksByGenre(
  genreId: number,
  limit = DEFAULT_LIMIT,
): Promise<DeezerTrack[]> {
  const data = await fetchJson<DeezerChartResponse>(
    `${DEEZER_BASE_URL}/chart/${genreId}/tracks?limit=${limit}`,
  );

  return data.data;
}
