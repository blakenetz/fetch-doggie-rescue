import { fetchBreeds } from "@/actions/dogs";
import {
  Stack,
  Drawer,
  RangeSlider,
  MultiSelect,
  Button,
  DrawerProps,
  Input,
} from "@mantine/core";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/App";

export interface FilterProps extends Omit<DrawerProps, "onSubmit"> {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Filters({ onSubmit, ...props }: FilterProps) {
  const ctx = useContext(AppContext);

  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    fetchBreeds().then(setBreeds).catch(ctx.handleError);
  }, []);

  return (
    <Drawer {...props} keepMounted>
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Input.Wrapper label="Age">
            <RangeSlider
              min={0}
              max={15}
              minRange={1}
              step={1}
              defaultValue={[0, 15]}
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
