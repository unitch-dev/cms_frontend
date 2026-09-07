import api from "./client";

export function getGenres() {
  return api.get("/genres");
}

export function getGenre(id) {
  return api.get(`/genres/${id}`);
}

export function createGenre(payload) {
  return api.post("/genres", payload);
}

export function updateGenre(id, payload) {
  return api.put(`/genres/${id}`, payload);
}

export function deleteGenre(id) {
  return api.delete(`/genres/${id}`);
}
