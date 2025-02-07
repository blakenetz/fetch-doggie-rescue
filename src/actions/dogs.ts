import { DogSearchResults, Dog, MatchResults } from "@/types";
import { base } from ".";
import z from "zod";

export const limit = 30;
// default options are 0-index
export const sortFields = ["breed", "name", "age"] as const;
export const sortDirections = ["asc", "desc"] as const;

export type SortField = (typeof sortFields)[number];
export type SortDirection = (typeof sortDirections)[number];

const DogSchema = z
  .object({
    ageMin: z.string(),
    ageMax: z.string(),
    breeds: z.string(),
    page: z.number(),
    sortField: z.enum(sortFields),
    sortDirection: z.enum(sortDirections),
  })
  .partial();

export type DogSchemaData = z.infer<typeof DogSchema>;

async function getDogIds(data?: DogSchemaData): Promise<DogSearchResults> {
  const url = new URL("dogs/search", base);

  // add filters
  if (data?.ageMin) url.searchParams.set("ageMin", `${data.ageMin}`);
  if (data?.ageMax) url.searchParams.set("ageMax", `${data.ageMax}`);
  if (data?.breeds) {
    data.breeds
      .split(",")
      .forEach((breed) => url.searchParams.set("breeds", breed));
  }

  // add pagination
  const from = (data?.page ?? 0) * limit;
  url.searchParams.set("size", limit.toString());
  url.searchParams.set("from", from.toString());

  // add sort
  const field: SortField = data?.sortField ?? sortFields[0];
  const direction: SortDirection = data?.sortDirection ?? sortDirections[0];
  url.searchParams.set("sort", `${field}:${direction}`);

  // make api call
  const res = await fetch(url, { method: "GET", credentials: "include" });

  if (!res.ok) throw res;
  return res.json();
}

async function getDogsByIds(searchData: DogSearchResults) {
  const url = new URL("dogs", base);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(searchData.resultIds),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw res;
  return {
    data: await res.json(),
    total: searchData.total,
  };
}

export async function fetchDogs(
  data?: DogSchemaData
): Promise<{ data: Dog[]; total: number }> {
  const results = await getDogIds(data);

  return getDogsByIds(results);
}

export async function fetchBreeds(): Promise<string[]> {
  const url = new URL("dogs/breeds", base);
  const res = await fetch(url, { method: "GET", credentials: "include" });
  if (!res.ok) throw res;
  return res.json();
}

export function validate(formData: FormData): DogSchemaData {
  const output = DogSchema.safeParse({
    ageMin: formData.get("age_from"),
    ageMax: formData.get("age_to"),
    breeds: formData.get("breeds"),
  });

  if (!output.success) throw new Error("Invalid form data");
  return output.data;
}

async function getMatch(ids: string[]): Promise<MatchResults> {
  const url = new URL("dogs/match", base);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(ids),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw res;
  return res.json();
}

export async function fetchMatch(ids: string[]): Promise<Dog> {
  const results = await getMatch(ids);

  const searchData: DogSearchResults = {
    resultIds: [results.match],
    total: 0,
    next: "",
    prev: "",
  };

  const { data } = await getDogsByIds(searchData);
  return data[0];
}
