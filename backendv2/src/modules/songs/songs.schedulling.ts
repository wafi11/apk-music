import YTMusic from "ytmusic-api";
import { albums, artists } from "../../db/songs";
import { db } from "../../lib/drizzle";
import { generateId } from "../../utils/generateID";

const songQueries = [""];
const artistQueries = [""];

export const getDataFromYoutube = async (type: "song" | "artist" | "album") => {
  const ytmusic = new YTMusic();
  await ytmusic.initialize();

  if (type === "artist") {
    const results = (
      await Promise.all(artistQueries.map((q) => ytmusic.searchArtists(q)))
    ).flat();
    console.log(`✅ Done ${results.length} artists`);
    return results;
  }

  if (type === "song") {
    const results = (
      await Promise.all(songQueries.map((q) => ytmusic.searchSongs(q)))
    ).flat();
    console.log(`✅ Done ${results.length} songs`);
    return results;
  }

  if (type === "album") {
    const artistList = await db
      .select({ ytId: artists.ytId, id: artists.id })
      .from(artists);

    for (const { ytId, id } of artistList) {
      const { topAlbums, artistId } = await ytmusic.getArtist(ytId ?? "");

      await Promise.all(
        topAlbums.map((album) =>
          db.insert(albums).values({
            id: generateId(),
            title: album.name,
            artistId: id,
            image: album.thumbnails[0].url.replace("w60-h60", "w480-h480"),
            ytId: album.albumId,
          }),
        ),
      );

      console.log(`✅ Done albums for artistId: ${artistId}`);
    }
  }

  return [];
};
