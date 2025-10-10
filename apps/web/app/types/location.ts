export interface MapLocation {
  id: string;
  type: 'home' | 'work' | 'recent' | 'frequent';
  coords: { lat: number; lng: number };
  title: string;
  description: string;
  timestamp?: Date;
}

// Mapbox Reverse Geocoding API Response Types

export interface MapboxCoordinates {
  longitude: number;
  latitude: number;
}

export interface MapboxGeometry {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface MapboxContextItem {
  mapbox_id: string;
  name: string;
  wikidata_id?: string;
  region_code?: string;
  region_code_full?: string;
  country_code?: string;
  country_code_alpha_3?: string;
}

export interface MapboxContext {
  district?: MapboxContextItem;
  region?: MapboxContextItem;
  country?: MapboxContextItem;
  postcode?: MapboxContextItem;
  place?: MapboxContextItem;
  locality?: MapboxContextItem;
  neighborhood?: MapboxContextItem;
  address?: MapboxContextItem;
  street?: MapboxContextItem;
}

export type MapboxFeatureType =
  | 'country'
  | 'region'
  | 'postcode'
  | 'district'
  | 'place'
  | 'locality'
  | 'neighborhood'
  | 'address'
  | 'street'
  | 'poi';

export interface MapboxFeatureProperties {
  mapbox_id: string;
  feature_type: MapboxFeatureType;
  full_address: string;
  name: string;
  name_preferred: string;
  coordinates: MapboxCoordinates;
  place_formatted: string;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  context: MapboxContext;
}

export interface MapboxFeature {
  type: 'Feature';
  id: string;
  geometry: MapboxGeometry;
  properties: MapboxFeatureProperties;
}

export interface MapboxReverseGeocodeResponse {
  type: 'FeatureCollection';
  features: MapboxFeature[];
  attribution: string;
}
