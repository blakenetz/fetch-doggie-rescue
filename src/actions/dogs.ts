import { Results, DogSearchResults, Dog } from "@/types";
import { base } from ".";
import z from "zod";

const DogSchema = z
  .object({
    ageMin: z.string(),
    ageMax: z.string(),
    breeds: z.string(),
  })
  .partial();
type DogSchemaData = z.infer<typeof DogSchema>;

async function handleResponse<T>(res: Response): Promise<Results<T>> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      message: data?.message || `Failed to gather resource`,
      status: res.status,
    };
  }

  return { ok: true, data } as Results<T>;
}

async function getDogIds(params?: DogSchemaData) {
  const url = new URL("dogs/search", base);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url, { method: "GET", credentials: "include" });
  return handleResponse<DogSearchResults>(res);
}

async function getDogsByIds(ids: string[]) {
  const url = new URL("dogs", base);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(ids),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<Dog[]>(res);
}

export async function fetchDogs(
  params?: DogSchemaData
): Promise<Results<Dog[]>> {
  const dogResults = await getDogIds(params);
  if (!dogResults.ok) return dogResults;

  return getDogsByIds(dogResults.data.resultIds);
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
