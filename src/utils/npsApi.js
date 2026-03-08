import { apiKey, lat, lng } from "./constants";

const checkResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(new Error(`Request failed with status ${res.status}`));
};

function parseLatLng(latLngStr) {
  if (!latLngStr) return null;
  const match = latLngStr.match(/lat:([-\d.]+),\s*long:([-\d.]+)/i);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function buildNpsParkUrl() {
  return `https://developer.nps.gov/api/v1/parks?&api_key=${apiKey}&limit=400`;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const r = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

function getParkData(userCoords) {
  const npsUrl = buildNpsParkUrl();
  const userLat = userCoords?.lat ?? lat;
  const userLng = userCoords?.lng ?? lng;
  return fetch(npsUrl)
    .then(checkResponse)
    .then((json) => {
      // console.log(json.data);
      return json.data.map((park) => {
        const coords = parseLatLng(park.latLong);
        const distanceMiles = coords
          ? calculateDistance(userLat, userLng, coords.lat, coords.lng)
          : null;
        return {
          id: park.id,
          fullName: park.fullName,
          images: park.images,
          address: park.addresses?.[0] ?? null,
          url: park.url,
          contact: park.contacts.phoneNumbers[0]?.phoneNumber ?? null,
          operatingHours: park.operatingHours?.[0]?.standardHours ?? null,
          parkCode: park.parkCode,
          description: park.description,
          state: park.states,
          latLong: park.latLong,
          activities: park.activities,
          distanceMiles,
        };
      });
    });
}

function getNearbyParks(parks, limit = 4) {
  return [...parks]
    .filter((park) => park.distanceMiles !== null)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
}

function getFeaturedParks(parks, limit = 5) {
  return [...parks]
    .filter((park) => (park.activities?.length ?? 0) >= 5)
    .filter((park) => (park.images?.length ?? 0) > 0)
    .slice(0, limit);
}

function getPopularActivities(parks) {
  const counts = {};
  parks.forEach((park) => {
    park.activities?.forEach((activity) => {
      counts[activity.name] = (counts[activity.name] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name]) => name);
}

export {
  checkResponse,
  getParkData,
  getNearbyParks,
  getFeaturedParks,
  getPopularActivities,
};
