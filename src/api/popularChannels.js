import api from "./client";
import { toRequestPayload } from "./formData";

export function getPopularChannels() {
  return api.get("/popular-channels");
}

export function getPopularChannel(id) {
  return api.get(`/popular-channels/${id}`);
}

export function createPopularChannel(fields) {
  return api.post("/popular-channels", toRequestPayload(fields));
}

export function updatePopularChannel(id, fields) {
  return api.put(`/popular-channels/${id}`, toRequestPayload(fields));
}

export function deletePopularChannel(id) {
  return api.delete(`/popular-channels/${id}`);
}
