import { eq, sql } from "drizzle-orm";
import { queueItems, queues } from "../../db/queue";
import { db } from "../../lib/drizzle";
import { convertLinkYt, generateId } from "../../utils/generateID";
import { CreateQueue } from "./queue";
import { downloadYtMusic } from "../../lib/songs/streaming_yt";
import { songs } from "../../db/songs";

export async function createQueue({ songs }: CreateQueue) {
  const { queueId } = await db.transaction(async (tx) => {
    await tx.delete(queueItems);
    await tx.delete(queues);

    const queueId = generateId();
    await tx.insert(queues).values({ id: queueId });

    for (const song of songs) {
      await tx.insert(queueItems).values({
        id: generateId(),
        queueId,
        songId: song.id,
      });
    }

    return { queueId };
  });

  for (const song of songs) {
    downloadAndUpdateLink(song.id).catch(console.error);
  }

  return queueId;
}

async function downloadAndUpdateLink(songId: string) {
  const [{ yt_id }] = await db
    .select({ yt_id: songs.ytId })
    .from(songs)
    .where(eq(songs.id, songId));

  const ytMusic = await downloadYtMusic(convertLinkYt(yt_id as string));
  const resource = ytMusic?.resources.find(
    (r) => r.download_mode === "check_download" && r.type === "audio",
  );

  await db
    .update(songs)
    .set({ linkYt: resource?.download_url })
    .where(eq(songs.id, songId));
}

export async function getQueueWithItems() {
  const result = sql`
    SELECT 
        qi.id,
        s.title,
        s.image,
        s.duration,
        s.link_yt as link,
        a.title as album,
        ar.name as artist
    FROM queue_items qi
    LEFT JOIN songs s on s.id = qi.song_id
    LEFT JOIN artists ar on ar.id = s.artists_id
    LEFT JOIN albums a on a.id = s.albums_id
  `;

  const data = await db.execute(result);
  return data.rows;
}

export async function deleteQueueItem(itemId: string): Promise<boolean> {
  const req = await db.delete(queues).where(eq(queues.id, itemId));
  return (req.rowCount ?? 0) > 0;
}
