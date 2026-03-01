import { Hono } from "hono";
import { getDataFromYoutube } from "../songs/songs.schedulling";
import { ErrorResponse, SuccessResponse } from "../../utils/response";

const app = new Hono();

app.get("/albums", async (c) => {
  try {
    await getDataFromYoutube("album");
    return SuccessResponse(c, "Successfully Sync Albums", 200, null);
  } catch (error) {
    console.error("[trends] error:", error);
    return ErrorResponse(c, "Failed to Sync Albums", 500);
  }
});

export default app;
