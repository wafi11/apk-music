import { and, gt, ilike } from "drizzle-orm";
import { artists } from "../../db/songs";
import { db } from "../../lib/drizzle";
import { RequestParams } from "../../types/request";

export async function getArtists(req: RequestParams) {
  const limit = parseInt(req.limit ?? "20");
  const { cursor, search } = req;

  const data = await db
    .select({
      id: artists.id,
      name: artists.name,
      image: artists.image,
    })
    .from(artists)
    .where(
      and(
        cursor ? gt(artists.id, cursor) : undefined,
        search ? ilike(artists.name, `%${search}%`) : undefined,
      ),
    )
    .limit(limit + 1);

  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, limit) : data;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return {
    items,
    nextCursor,
    hasNextPage,
  };
}
