import { and, eq, gt, ilike } from "drizzle-orm";
import { albums, artists, songs } from "../../db/songs";
import { db } from "../../lib/drizzle";
import { RequestParams } from "../../types/request";
import { generateId } from "../../utils/generateID";

export async function findSongs(req: RequestParams) {
  const limit = parseInt(req.limit ?? "20");
  const { cursor, search } = req;
  const data = await db
    .select({
      title: songs.title,
      image: songs.image,
      id: songs.id,
      link: songs.linkYt,
      artist: artists.name,
      album: albums.title,
    })
    .from(songs)
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .where(
      and(
        cursor ? gt(songs.id, cursor) : undefined,
        search ? ilike(songs.title, `%${search}%`) : undefined,
      ),
    )
    .limit(limit + 1)
    .offset(0);

  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, limit) : data;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return {
    items,
    nextCursor,
    hasNextPage,
  };
}

export async function createSongs(
  idYt: string,
  title: string,
  image: string,
  link: string,
  description: string,
  duration: string,
  albumId?: string,
  artistId?: string,
) {
  const songId = generateId();

  const req = await db.insert(songs).values({
    id: songId,
    title,
    albumId,
    artistId,
    image,
    ytId: idYt,
    description,
    linkYt: link,
    duration,
  });

  return req;
}

type GetSongsParams = {
  albumId?: string;
  artistId?: string;
  search?: string;
  limit?: string;
  cursor?: string;
};

export async function getSongsBy(params: GetSongsParams) {
  const limit = parseInt(params.limit ?? "10");

  const data = await db
    .select({
      id: songs.id,
      title: songs.title,
      duration: songs.duration,
      image: songs.image,
      ytId: songs.ytId,
      link: songs.linkYt,
      artist: artists.name,
    })
    .from(songs)
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .where(
      and(
        params.cursor ? gt(songs.id, params.cursor) : undefined,
        params.albumId ? eq(songs.albumId, params.albumId) : undefined,
        params.artistId ? eq(songs.artistId, params.artistId) : undefined,
        params.search ? ilike(songs.title, `%${params.search}%`) : undefined,
      ),
    )
    .limit(limit + 1);

  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, limit) : data;

  return {
    items,
    nextCursor: hasNextPage ? items[items.length - 1].id : null,
    hasNextPage,
  };
}
