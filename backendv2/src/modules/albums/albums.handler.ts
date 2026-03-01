import { Hono } from "hono";
import { findAlbumByID, findAlbums } from "./albums.repository";
import { ErrorResponse, SuccessResponse } from "../../utils/response";

const app = new Hono();

app.get("", async (c) => {
  const { search, limit, cursor } = c.req.query();
  try {
    const data = await findAlbums({ limit, cursor, search });
    return SuccessResponse(c, "Successfully Get Albums", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed to find Albums", 500);
  }
});

app.get("/artist/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const data = await findAlbums({
      artistId: id,
    });
    return SuccessResponse(c, "Successfully Get Albums Artists", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed to find Albums Artists", 500);
  }
});

app.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const data = await findAlbumByID(id);
    return SuccessResponse(c, "Successfully Get Albums", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed to find Albums", 500);
  }
});

export default app;
