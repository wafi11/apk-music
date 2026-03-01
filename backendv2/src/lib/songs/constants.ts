export const OPENWHYD_URL = "https://openwhyd.org";
export const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};
export const YT_MUSIC_API_URL =
  "https://api.vidssave.com/api/contentsite_api/media/parse";

export const DEFAULT_HEADERS_YT_MUSIC: HeadersInit = {
  "Content-Type": "application/x-www-form-urlencoded",
  Origin: "https://vidssave.com",
  Referer: "https://vidssave.com/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "X-Requested-With": "XMLHttpRequest",
};
export const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0";
export const LASTFM_API_KEY = process.env.LASTFM_API_KEY ?? "";
export const DEFAULT_LIMIT = 10;
export const DEEZER_BASE_URL = "https://api.deezer.com";
