import api from "./client";

export function login(username, password) {
  return api.post("/login", { username, password });
}

export function me() {
  return api.get("/me");
}

export function createUser(payload) {
  return api.post("/users", payload);
}
