export const fields = ["name", "email"] as const;
export type Field = (typeof fields)[number];
export type FormState = Partial<Record<Field | "form", string>>;
