export const fields = ["name", "email"] as const;
export type Field = (typeof fields)[number];
export type FormState = Partial<Record<Field | "form", string>>;

type SuccessResults<T = undefined> = T extends undefined
  ? { ok: true }
  : { ok: true; data: T };
type ErrorResults = {
  ok: false;
  message?: string;
  errors?: Record<string, string | string[] | undefined>;
  status: number;
};
export type Results<T = undefined> = SuccessResults<T> | ErrorResults;

export interface DogSearchResults {
  resultIds: string[];
  total: number;
  next: string;
  prev: string;
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
