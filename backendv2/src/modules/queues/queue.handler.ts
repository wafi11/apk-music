import { Hono } from "hono";
import { createQueue, getQueueWithItems } from "./queue.repository";
import { ErrorResponse, SuccessResponse } from "../../utils/response";
import { CreateQueue } from "./queue";

const app = new Hono();

app.post("", async (c) => {
  try {
    const { songs }: CreateQueue = await c.req.json();
    const queue = await createQueue({ songs });
    return SuccessResponse(c, "Successfully Create Queue Music", 201, queue);
  } catch (error) {
    console.error("[queues] error:", error);
    return ErrorResponse(c, "Failed to Create Queue Music", 500);
  }
});

app.get("", async (c) => {
  try {
    const queues = await getQueueWithItems();
    return SuccessResponse(
      c,
      "Successfully Retreived Queue Music",
      200,
      queues,
    );
  } catch (error) {
    console.error("[queues] error:", error);

    return ErrorResponse(c, "Failed to retreived Queue Music", 500);
  }
});

export default app;
