import { ulid } from "ulid";

export function generateId(): string {
  return ulid();
}

export function convertLinkYt(id: string) {
  return `https://music.youtube.com/watch?v=${id}`;
}
