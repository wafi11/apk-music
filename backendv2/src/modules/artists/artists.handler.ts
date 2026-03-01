import { Hono } from "hono";
import { getArtists } from "./artists.repository";
import { ErrorResponse, SuccessResponse } from "../../utils/response";

const app = new Hono();

app.get("", async (c) => {
  const { search, limit, cursor } = c.req.query();
  try {
    const data = await getArtists({ limit, cursor, search });
    return SuccessResponse(c, "Successfully Get Artists", 200, data);
  } catch (error) {
    return ErrorResponse(c, "Failed to find Artists", 500);
  }
});

export default app;
