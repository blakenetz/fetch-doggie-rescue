import { Dog } from "@/types";
import { clean } from "@/utils";
import { Stack, Text } from "@mantine/core";

const fields: (keyof Dog)[] = ["name", "age", "breed", "zip_code"];

export interface DogDataProps {
  dog: Dog;
}

export default function DogData({ dog }: DogDataProps) {
  return (
    <Stack gap={2} mt="md">
      {fields.map((field) => (
        <Text size="sm" key={field}>
          {clean(field)}:{" "}
          <Text inherit component="span" c="dimmed">
            {dog[field]}
          </Text>
        </Text>
      ))}
    </Stack>
  );
}
