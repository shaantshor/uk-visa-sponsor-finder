const BASE_URL = '/api';

async function fetchJSON(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function getSponsors(params) {
  return fetchJSON('/sponsors', params);
}

export function getSponsor(id) {
  return fetchJSON(`/sponsors/${id}`);
}

export function getSimilarCompanies(id) {
  return fetchJSON(`/sponsors/${id}/similar`);
}

export function getCities() {
  return fetchJSON('/sponsors/cities');
}

export function getIndustries() {
  return fetchJSON('/sponsors/industries');
}

export function getTrending() {
  return fetchJSON('/sponsors/trending');
}

export function getStats() {
  return fetchJSON('/stats');
}
