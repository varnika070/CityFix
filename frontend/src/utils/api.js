const BASE = "http://localhost:5000/api";

export const api = async (endpoint, method = "GET", body = null, token = null, isForm = false) => {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};