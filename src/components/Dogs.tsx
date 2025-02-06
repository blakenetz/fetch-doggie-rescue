import { fetchBreeds, fetchDogs, filterDogs } from "@/actions/dogs";
import Filters, { FilterProps } from "@/components/Filters";
import Footer from "@/components/Footer";
import { AppContext } from "@/context/App";
import { AuthContext } from "@/context/Auth";
import { Dog, Results } from "@/types";
import { Card, Image, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import NoResults from "./NoResults";

const placeholders = Array.from({ length: 16 }, (_el, i) => i);

export default function Dogs() {
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);

  function handleResults<T extends (Dog | string)[]>(
    res: Results<T>,
    setter: (value: T) => void
  ) {
    if (res.ok) setter(res.data as T);
    else {
      if (res.status === 401) authCtx.logout();
      else {
        console.error(res);
        appCtx.setErrorMsg(res.message ?? "An unexpected error occurred.");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      const [dogRes, breedRes] = await Promise.all([
        fetchDogs(),
        fetchBreeds(),
      ]);
      handleResults(dogRes, setDogs);
      handleResults(breedRes, setBreeds);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit: FilterProps["onSubmit"] = async (e) => {
    e.preventDefault();
    setShowFilter(false);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await filterDogs(formData);
    handleResults(res, setDogs);
  };

  const reset = async () => {
    setLoading(true);
    const res = await fetchDogs();
    handleResults(res, setDogs);
  };

  return (
    <>
      {!loading && !dogs.length && <NoResults reset={reset} />}

      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4, xl: 5 }} mb={60}>
        {loading
          ? placeholders.map((i) => <Skeleton key={i} w={240} h={260} />)
          : dogs.map((dog) => (
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                key={dog.id}
              >
                <Card.Section>
                  <Image src={dog.img} height={160} alt={dog.name} />
                </Card.Section>

                <Stack gap={2} mt="md">
                  <Text size="sm">
                    Age:{" "}
                    <Text inherit component="span" c="dimmed">
                      {dog.age}
                    </Text>
                  </Text>
                  <Text size="sm">
                    Breed:{" "}
                    <Text inherit component="span" c="dimmed">
                      {dog.breed}
                    </Text>
                  </Text>
                  <Text size="sm">
                    Zip Code:{" "}
                    <Text inherit component="span" c="dimmed">
                      {dog.zip_code}
                    </Text>
                  </Text>
                </Stack>
              </Card>
            ))}
      </SimpleGrid>

      <Filters
        onSubmit={handleFilterSubmit}
        opened={showFilter}
        onClose={() => setShowFilter(false)}
        breeds={breeds}
      />

      <Footer onFilterClick={() => setShowFilter(true)} />
    </>
  );
}
