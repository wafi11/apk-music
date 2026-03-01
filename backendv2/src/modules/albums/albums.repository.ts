import { and, eq, gt, ilike } from "drizzle-orm";
import { albums, artists } from "../../db/songs";
import { db } from "../../lib/drizzle";

type GetAlbumsParams = {
  artistId?: string;
  search?: string;
  limit?: string;
  cursor?: string;
};

export async function findAlbumByID(id: string) {
  const data = await db
    .select({
      id: albums.id,
      title: albums.title,
      image: albums.image,
      artist: artists.name,
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .where(eq(albums.id, id));

  return data[0];
}
export async function findAlbums(params: GetAlbumsParams) {
  const limit = parseInt(params.limit ?? "10");

  const data = await db
    .select({
      id: albums.id,
      title: albums.title,
      image: albums.image,
      ytId: albums.ytId,
      artist: artists.name,
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .where(
      and(
        params.cursor ? gt(albums.id, params.cursor) : undefined,
        params.artistId ? eq(albums.artistId, params.artistId) : undefined,
        params.search ? ilike(albums.title, `%${params.search}%`) : undefined,
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
