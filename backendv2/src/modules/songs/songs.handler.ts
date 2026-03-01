import { Hono } from "hono";
import { findSongs, getSongsBy } from "./songs.services";
import { ErrorResponse, SuccessResponse } from "../../utils/response";
import { getLyricsByTitle } from "../../lib/songs/lyric";

const app = new Hono();

app.get("", async (c) => {
  const { search, limit, cursor } = c.req.query();
  try {
    const data = await findSongs({ limit, cursor, search });
    return SuccessResponse(c, "Successfully Get Songs", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed to find Songs", 500);
  }
});

app.get("/lyric", async (c) => {
  const { title, artist, album, duration } = c.req.query();
  try {
    const lyrics = await getLyricsByTitle(title, album, duration, artist);
    if (!lyrics)
      return c.json({ success: false, message: "Lyrics not found" }, 404);
    return c.json({ success: true, data: lyrics });
  } catch {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});

app.get("/artist/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const data = await getSongsBy({
      artistId: id,
    });
    return SuccessResponse(c, "Successfully Get Song Artist", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed To Get Song Artist", 500);
  }
});

app.get("/album/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const data = await getSongsBy({
      albumId: id,
    });
    return SuccessResponse(c, "Successfully Get Song Album", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed To Get Song Album", 500);
  }
});

export default app;
