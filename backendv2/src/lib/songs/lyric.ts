export async function getLyricsByTitle(
  title: string,
  album: string,
  duration: string,
  artist: string,
) {
  const res = await fetch(
    `https://lrclib.net/api/search?track_name=${encodeURIComponent(title)}&album_name=${encodeURIComponent(album)}&duration=${encodeURIComponent(duration)}&artist_name=${encodeURIComponent(artist)}`,
  );

  const data = await res.json();
  if (!data.length) return null;

  return {
    plain: data[0]?.plainLyrics ?? null,
    synced: data[0]?.syncedLyrics ?? null,
  };
}
