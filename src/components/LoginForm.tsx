import { AuthContext } from "@/context/Auth";
import { fields, FormState } from "@/types";
import { Button, Loader, Paper, Stack, Text, TextInput } from "@mantine/core";
import { FormEventHandler, useContext, useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormState>({});
  const ctx = useContext(AuthContext);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await ctx.login(formData);

    if (!res.ok) setErrors(res.errors ?? {});

    setIsLoading(false);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} py="lg" px="sm" shadow="md">
      <Stack>
        {fields.map((field, i) => (
          <TextInput
            key={field}
            label={field}
            name={field}
            autoComplete={field}
            autoFocus={i === 0}
            disabled={isLoading}
            error={errors[field]}
            // reset errors
            onFocus={() => setErrors((prev) => ({ ...prev, [field]: "" }))}
            // validate on blur
            onBlur={(e) => {
              const { value } = e.target;
              setErrors((prev) => ({
                ...prev,
                [field]: value ? "" : "Required",
              }));
            }}
          />
        ))}

        {errors.form && <Text c="red">{errors.form}</Text>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader size="sm" /> : "Continue"}
        </Button>
      </Stack>
    </Paper>
  );
}
