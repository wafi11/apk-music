import * as fs from "fs";
import * as path from "path";
import { albums, artists, songs } from "../../db/songs";
import { db } from "../../lib/drizzle";
import { convertLinkYt, generateId } from "../../utils/generateID";
import { ResponseFromYoutube } from "./songs";
import { downloadYtMusic } from "../../lib/songs/streaming_yt";
import { eq } from "drizzle-orm";

export async function updateLinkYt() {
  const data = await db.select({ id: songs.id, ytId: songs.ytId }).from(songs);

  for (const song of data) {
    const resultYt = await downloadYtMusic(convertLinkYt(song.ytId as string));
    const audioResource = resultYt.resources.find(
      (i) => i.download_mode === "check_download" && i.type === "audio",
    );

    if (!audioResource) {
      console.log(`⏭️ Skipped (no audio resource): ${song.id}`);
      continue;
    }

    await db
      .update(songs)
      .set({ linkYt: audioResource.download_url })
      .where(eq(songs.id, song.id));
  }

  console.log("Update successfully ");
}

export async function convertArtistJsonToDb() {
  const filePath = path.join(process.cwd(), "data", "artist.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);

  const results = json.results;

  for (const artist of results) {
    await db.insert(artists).values({
      id: generateId(),
      name: artist.name ?? "",
      ytId: artist.artistId ?? "",
      image: artist.thumbnails?.[artist.thumbnails.length - 1]?.url ?? "",
    });
  }
}
export async function convertSongsJsonToDb() {
  const filePath = path.join(process.cwd(), "data", "songs.json");
  const results = (
    JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
      results: ResponseFromYoutube[];
    }
  ).results;

  // load sekali, jadikan Map untuk lookup O(1)
  const artistMap = new Map(
    (await db.select({ id: artists.id, ytId: artists.ytId }).from(artists)).map(
      (a) => [a.ytId?.toLowerCase(), a.id],
    ),
  );

  const albumMap = new Map(
    (await db.select({ id: albums.id, ytId: albums.ytId }).from(albums)).map(
      (al) => [al.ytId?.toLowerCase(), al.id],
    ),
  );

  let inserted = 0;

  for (const song of results) {
    const artistId = artistMap.get(song.artist?.artistId?.toLowerCase());
    if (!artistId) {
      console.log(`⏭️ Skipped (artist not found): ${song.name}`);
      continue;
    }

    const resultYt = await downloadYtMusic(convertLinkYt(song.videoId));
    const audioResource = resultYt.resources.find(
      (i) => i.download_mode === "check_download" && i.type === "audio",
    );

    if (!audioResource) {
      console.log(`⏭️ Skipped (no audio resource): ${song.name}`);
      continue;
    }

    await db
      .insert(songs)
      .values({
        id: generateId(),
        title: song.name,
        artistId,
        albumId: albumMap.get(song.album?.albumId?.toLowerCase()) ?? null,
        description: "",
        duration: song.duration?.toString() ?? "",
        image: song.thumbnails?.[0]?.url.replace("w60-h60", "w480-h480") ?? "",
        ytId: song.videoId,
        linkYt: audioResource.download_url,
      })
      .onConflictDoNothing({ target: songs.ytId });

    console.log(`✅ Inserted: ${song.name}`);
    inserted++;
  }

  console.log(`✅ Done! Inserted ${inserted}/${results.length}`);
}
