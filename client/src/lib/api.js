const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const buildHeaders = ({ token, hasBody, headers = {} }) => {
  const resolvedHeaders = {
    ...headers,
  };

  if (hasBody) {
    resolvedHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    resolvedHeaders.Authorization = `Bearer ${token}`;
  }

  return resolvedHeaders;
};

export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, token, headers } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders({
      token,
      hasBody: body !== undefined,
      headers,
    }),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const rawResponse = await response.text();
  const data = rawResponse ? JSON.parse(rawResponse) : null;

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed.');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const profileApi = {
  getMyProfile: (token) => apiRequest('/me/profile', { token }),
  saveMyProfile: (token, payload) =>
    apiRequest('/me/profile', {
      method: 'PUT',
      token,
      body: payload,
    }),
};

export const eventsApi = {
  listEvents: () => apiRequest('/events'),
  getEvent: (eventId) => apiRequest(`/events/${eventId}`),
  applyToEvent: (eventId, token, payload) =>
    apiRequest(`/events/${eventId}/applications`, {
      method: 'POST',
      token,
      body: payload,
    }),
};

export const applicationsApi = {
  listMyApplications: (token) => apiRequest('/me/applications', { token }),
  getMyApplicationById: (applicationId, token) =>
    apiRequest(`/me/applications/${applicationId}`, { token }),
  withdrawMyApplication: (applicationId, token) =>
    apiRequest(`/me/applications/${applicationId}`, {
      method: 'DELETE',
      token,
    }),
};
