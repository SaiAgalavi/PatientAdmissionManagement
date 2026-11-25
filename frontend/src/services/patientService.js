
const API_URL = import.meta.env.VITE_API_URL;

async function request(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Something went wrong");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const patientService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const query = params.toString();
    return request(`/patients${query ? `?${query}` : ""}`);
  },

  add: (patient) =>
    request("/patients", {
      method: "POST",
      body: JSON.stringify(patient),
    }),

  update: (id, patient) =>
    request(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(patient),
    }),

  discharge: (id) =>
    request(`/patients/${id}/discharge`, {
      method: "PATCH",
    }),

  delete: (id) =>
    request(`/patients/${id}`, {
      method: "DELETE",
    }),
};
