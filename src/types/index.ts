export const fields = ["name", "email"] as const;
export type Field = (typeof fields)[number];
export type FormState = Partial<Record<Field | "form", string>>;

export interface DogSearchResults {
  resultIds: string[];
  total: number;
  next: string;
  prev: string;
}

export interface MatchResults {
  match: string;
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}
export interface Coordinates {
  lat: number;
  lon: number;
}
