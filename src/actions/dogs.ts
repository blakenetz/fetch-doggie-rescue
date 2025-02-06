import { Results, DogSearchResults, Dog } from "@/types";
import { base } from ".";

async function getDogIds(): Promise<Results<DogSearchResults>> {
  const url = new URL("dogs/search", base);
  const res = await fetch(url, { method: "GET", credentials: "include" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    return {
      ok: false,
      message: errorData?.message || `Search failed with status ${res.status}`,
      status: res.status,
    };
  }
  return {
    ok: true,
    data: await res.json(),
  };
}

async function getDogsByIds(ids: string[]): Promise<Results<Dog[]>> {
  const url = new URL("dogs", base);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(ids),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    return {
      ok: false,
      message:
        errorData?.message || `Failed to get dogs with status ${res.status}`,
      status: res.status,
    };
  }
  return {
    ok: true,
    data: await res.json(),
  };
}

export async function fetchDogs(): Promise<Results<Dog[]>> {
  const dogResults = await getDogIds();
  if (!dogResults.ok) return dogResults;

  return getDogsByIds(dogResults.data.resultIds);
}
