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

    // attempt to login
    const formData = new FormData(e.currentTarget);
    const res = await ctx.login(formData);
    // if login fails, set errors
    if (!res.ok) setErrors(res.errors ?? {});

    setIsLoading(false);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} p="lg" shadow="md">
      <Stack>
        <Text ta="center">
          Before we begin, we need to get some information from you
        </Text>
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

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          Continue
        </Button>
      </Stack>
    </Paper>
  );
}
