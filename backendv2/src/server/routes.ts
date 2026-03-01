import { Hono } from "hono";
import songsRoutes from "../modules/songs/songs.handler";
import artistsRoutes from "../modules/artists/artists.handler";
import queueRoutes from "../modules/queues/queue.handler";
import albumsRoutes from "../modules/albums/albums.handler";
import schedullingRoutes from "../modules/cronjob/handler";

const app = new Hono();

app.route("/songs", songsRoutes);
app.route("/artists", artistsRoutes);
app.route("/queues", queueRoutes);
app.route("/albums", albumsRoutes);
app.route("/sync", schedullingRoutes);

export default app;
