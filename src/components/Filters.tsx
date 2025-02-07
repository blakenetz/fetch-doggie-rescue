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
import { AuthContext } from "@/context/Auth";

export interface FilterProps extends Omit<DrawerProps, "onSubmit"> {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Filters({ onSubmit, ...props }: FilterProps) {
  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);

  const [breeds, setBreeds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetchBreeds();
      if (res.ok) setBreeds(res.data);
      else {
        if (res.status === 401) authCtx.logout();
        else {
          console.error(res);
          appCtx.setErrorMsg(res.message ?? "An unexpected error occurred.");
        }
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
