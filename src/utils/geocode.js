import { checkResponse } from "./npsApi";

export default function getLatLongFromZip(zip) {
  const apiKey = "0f7b867fb5d04fae93b6bf673f1165df";
  const params = new URLSearchParams({
    q: zip,
    countrycode: "us",
    limit: "1",
    no_annotations: "1",
    key: apiKey,
  });
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?${params.toString()}`;
  return fetch(apiUrl)
    .then((res) => checkResponse(res))

    .then((data) => {
      const results = data.results?.[0];
      if (!results) {
        return null;
      }
      const { lat, lng } = results.geometry;
      return { lat, lng };
    })
    .catch((error) => {
      console.error("Error fetching geocoding data:", error);
      return null;
    });
}
