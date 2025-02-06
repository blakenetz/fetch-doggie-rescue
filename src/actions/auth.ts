import { z } from "zod";
import { base } from ".";
import { Results } from "@/types";

const LoginSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
});
type LoginFormData = z.infer<typeof LoginSchema>;

export async function authenticate(body: LoginFormData) {
  const url = new URL("auth/login", base);

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

export async function login(formData: FormData): Promise<Results> {
  let body: LoginFormData;
  try {
    // validate form body
    body = LoginSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return {
        ok: false,
        errors: { ...err.flatten().fieldErrors },
        status: 400,
      };
    return {
      ok: false,
      errors: { form: "An unknown error occurred. Please try again" },
      status: 500,
    };
  }

  // authenticate
  const res = await authenticate(body);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return {
      ok: false,
      errors: {
        form: data?.message || `Login failed with status ${res.status}`,
      },
      status: res.status,
    };
  }

  return { ok: true };
}

export async function logout() {
  const url = new URL("auth/login", base);

  return fetch(url, { method: "POST" });
}
