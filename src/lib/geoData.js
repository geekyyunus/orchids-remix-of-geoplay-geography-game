
export const MAP_URLS = {
  world: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  usa: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
  india: "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json",
};

export const CITIES_DATA = [
  { name: "New York", lat: 40.7128, lng: -74.006, state: "New York", country: "USA" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, state: "California", country: "USA" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, state: "Maharashtra", country: "India" },
  { name: "Delhi", lat: 28.6139, lng: 77.209, state: "Delhi", country: "India" },
  { name: "London", lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
  { name: "Paris", lat: 48.8566, lng: 2.3522, country: "France" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, country: "Japan" },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, country: "Australia" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, country: "Egypt" },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, country: "Brazil" },
];

export const COUNTRIES_WITH_STATES = [
  { id: "usa", name: "USA", url: MAP_URLS.usa },
  { id: "india", name: "India", url: MAP_URLS.india },
];
