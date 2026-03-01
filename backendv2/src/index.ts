import { Hono } from "hono";
import routes from "./server/routes";
import { cors } from "hono/cors";
import {
  convertArtistJsonToDb,
  convertSongsJsonToDb,
  updateLinkYt,
} from "./modules/songs/convert";

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 600,
  }),
);

app.route("/api", routes);
// updateLinkYt();
// convertArtistJsonToDb();
// convertSongsJsonToDb();

export default {
  port: 4000,
  fetch: app.fetch,
};
