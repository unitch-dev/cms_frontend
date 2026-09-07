import api from "./client";
import { toRequestPayload } from "./formData";

export function getBanners() {
  return api.get("/banners");
}

export function getBanner(id) {
  return api.get(`/banners/${id}`);
}

export function createBanner(fields) {
  return api.post("/banners", toRequestPayload(fields));
}

export function updateBanner(id, fields) {
  return api.put(`/banners/${id}`, toRequestPayload(fields));
}

export function deleteBanner(id) {
  return api.delete(`/banners/${id}`);
}
