import api from "./client";
import { toRequestPayload } from "./formData";

export function getAdvertisements() {
  return api.get("/advertisements");
}

export function getAdvertisement(id) {
  return api.get(`/advertisements/${id}`);
}

export function createAdvertisement(fields) {
  return api.post("/advertisements", toRequestPayload(fields));
}

export function updateAdvertisement(id, fields) {
  return api.put(`/advertisements/${id}`, toRequestPayload(fields));
}

export function deleteAdvertisement(id) {
  return api.delete(`/advertisements/${id}`);
}
