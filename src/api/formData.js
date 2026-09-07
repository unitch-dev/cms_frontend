/**
 * The backend's create/update routes accept either application/json or
 * multipart/form-data (when uploading an image file). This picks the right
 * one automatically: if any value is a File, build FormData; otherwise
 * return the plain object so axios sends normal JSON.
 *
 * Array/object fields (e.g. "device") get JSON.stringify'd when going
 * through FormData, since multipart fields are always strings - the
 * backend's parseMultipartFields middleware parses them back out.
 */
export function toRequestPayload(fields) {
  const hasFile = Object.values(fields).some((v) => v instanceof File);

  if (!hasFile) {
    return fields;
  }

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) || typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}
