/**
 *Type Interface for JSON Object Responses of the TomTom Points of Interest Search API
 */
export interface ITomTomPOIResponse {
  summary: Summary;
  results: Result[];
}

export interface GeoBias {
  lat: number;
  lon: number;
}

export interface Summary {
  query: string;
  queryType: string;
  queryTime: number;
  numResults: number;
  offset: number;
  totalResults: number;
  fuzzyLevel: number;
  geoBias: GeoBias;
}

export interface CategorySet {
  id: number;
}

export interface Name {
  nameLocale: string;
  name: string;
}

export interface Classification {
  code: string;
  names: Name[];
}

export interface Brand {
  name: string;
}

export interface Poi {
  name: string;
  phone: string;
  categorySet: CategorySet[];
  categories: string[];
  classifications: Classification[];
  url: string;
  brands: Brand[];
}

export interface Address {
  streetNumber: string;
  streetName: string;
  municipalitySubdivision: string;
  municipality: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countrySubdivisionName: string;
  postalCode: string;
  extendedPostalCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName: string;
}

export interface Position {
  lat: number;
  lon: number;
}

export interface TopLeftPoint {
  lat: number;
  lon: number;
}

export interface BtmRightPoint {
  lat: number;
  lon: number;
}

export interface Viewport {
  topLeftPoint: TopLeftPoint;
  btmRightPoint: BtmRightPoint;
}

export interface Position2 {
  lat: number;
  lon: number;
}

export interface EntryPoint {
  type: string;
  position: Position2;
}

export interface PoiDetail {
  id: string;
  sourceName: string;
}

export interface DataSources {
  poiDetails: PoiDetail[];
}

export interface Result {
  type: string;
  id: string;
  score: number;
  dist: number;
  info: string;
  poi: Poi;
  address: Address;
  position: Position;
  viewport: Viewport;
  entryPoints: EntryPoint[];
  dataSources: DataSources;
}
