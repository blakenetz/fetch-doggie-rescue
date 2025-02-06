import {
  Stack,
  Drawer,
  RangeSlider,
  MultiSelect,
  Button,
  DrawerProps,
  Input,
} from "@mantine/core";
import { FormEvent } from "react";

export interface FilterProps extends Omit<DrawerProps, "onSubmit"> {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  breeds: string[];
}

export default function Filters({ onSubmit, breeds, ...props }: FilterProps) {
  return (
    <Drawer {...props}>
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Input.Wrapper label="Age">
            <RangeSlider
              min={0}
              max={20}
              step={1}
              defaultValue={[0, 20]}
              name="age"
              thumbFromLabel="Minimum age"
              thumbToLabel="Maximum age"
            />
          </Input.Wrapper>

          <MultiSelect label="Breed" data={breeds} searchable name="breeds" />
          <Button type="submit">Filter</Button>
        </Stack>
      </form>
    </Drawer>
  );
}
