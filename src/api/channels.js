import api from "./client";
import { toRequestPayload } from "./formData";

export function getChannels() {
  return api.get("/channels");
}

export function getChannel(id) {
  return api.get(`/channels/${id}`);
}

export function createChannel(fields) {
  return api.post("/channels", toRequestPayload(fields));
}

export function updateChannel(id, fields) {
  return api.put(`/channels/${id}`, toRequestPayload(fields));
}

export function deleteChannel(id) {
  return api.delete(`/channels/${id}`);
}
export function bulkUploadChannels(formData) {
  return api.post("/channels/bulk-upload", formData);
}

export function bulkUploadImages(formData) {
  return api.post("/channels/bulk-image-upload", formData);
}
