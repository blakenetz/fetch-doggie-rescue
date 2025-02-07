import { Results, DogSearchResults, Dog } from "@/types";
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

async function handleResponse<T>(
  res: Response,
  total?: number
): Promise<Results<T>> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      message: data?.message || `Failed to gather resource`,
      status: res.status,
    };
  }

  return { ok: true, data, total: total ?? data.length } as Results<T>;
}

async function getDogIds(data?: DogSchemaData) {
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
  return handleResponse<DogSearchResults>(res);
}

async function getDogsByIds(searchData: DogSearchResults) {
  const url = new URL("dogs", base);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(searchData.resultIds),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<Dog[]>(res, searchData.total);
}

export async function fetchDogs(data?: DogSchemaData): Promise<Results<Dog[]>> {
  const res = await getDogIds(data);
  if (!res.ok) return res;

  return getDogsByIds(res.data);
}

export async function fetchBreeds(): Promise<Results<string[]>> {
  const url = new URL("dogs/breeds", base);
  const res = await fetch(url, { method: "GET", credentials: "include" });
  return handleResponse<string[]>(res);
}

export async function filterDogs(formData: FormData): Promise<Results<Dog[]>> {
  const output = DogSchema.safeParse({
    ageMin: formData.get("age_from"),
    ageMax: formData.get("age_to"),
    breeds: formData.get("breeds"),
  });

  if (!output.success) {
    return { ok: false, message: "Invalid form data", status: 400 };
  }
  return fetchDogs(output.data);
}
