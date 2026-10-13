import api from "./client";

/**
 * Advertisements always send multipart/form-data, and unlike the shared
 * toRequestPayload helper this one KEEPS empty strings, so clearing a
 * start date / end date / time / video URL in the form really clears it
 * on the server. Arrays (channelIds, genreIds) go as JSON strings ("[1,2]"),
 * which the backend's parseIdList reads. null / undefined are skipped.
 */
function toAdFormData(fields) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) fd.append(key, value);
    else if (Array.isArray(value)) fd.append(key, JSON.stringify(value));
    else fd.append(key, value);
  });
  return fd;
}

export function getAdvertisements(params) {
  return api.get("/advertisements", { params });
}

export function getAdvertisement(id) {
  return api.get(`/advertisements/${id}`);
}

/* ---------- image ads ---------- */
export function createAdvertisement(fields) {
  return api.post("/advertisements", toAdFormData(fields));
}

export function updateAdvertisement(id, fields) {
  return api.put(`/advertisements/${id}`, toAdFormData(fields));
}

/* ---------- video ads ---------- */
export function createVideoAdvertisement(fields) {
  return api.post("/advertisements/video", toAdFormData(fields));
}

export function updateVideoAdvertisement(id, fields) {
  return api.post(`/advertisements/${id}/video`, toAdFormData(fields));
}

export function deleteAdvertisement(id) {
  return api.delete(`/advertisements/${id}`);
}