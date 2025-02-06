import { Button, Text, Stack } from "@mantine/core";

export interface NoResultsProps {
  reset: () => void;
}

export default function NoResults({ reset }: NoResultsProps) {
  return (
    <Stack>
      <Text ta="center">No results found</Text>
      <Button onClick={reset}>Reset filters</Button>
    </Stack>
  );
}
