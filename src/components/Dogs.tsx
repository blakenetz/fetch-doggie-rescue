import { DogSchemaData, fetchDogs, limit, validate } from "@/actions/dogs";
import Filters, { FilterProps } from "@/components/Filters";
import Footer from "@/components/Footer";
import NoResults from "@/components/NoResults";
import { AppContext } from "@/context/App";
import { AuthContext } from "@/context/Auth";
import { Dog, Results } from "@/types";
import {
  ActionIcon,
  Card,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconHeart } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

const placeholders = Array.from({ length: 16 }, (_el, i) => i);

export default function Dogs() {
  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [total, setTotal] = useState(0);
  const [schemaData, setSchemaData] = useState<DogSchemaData>();

  const favorites = useSet<string>([]);

  function handleError(res: Results<Dog[]>) {
    if (res.ok) return;
    if (res.status === 401) authCtx.logout();
    else {
      console.error(res);
      appCtx.setErrorMsg(res.message ?? "An unexpected error occurred.");
    }
  }

  function handleResults(res: Results<Dog[]>) {
    if (!res.ok) handleError(res);
    else {
      setDogs(res.data);
      if (res.total) setTotal(res.total);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      const res = await fetchDogs();
      handleResults(res);

      if (res.ok && res.total) setTotal(res.total);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter: FilterProps["onSubmit"] = async (e) => {
    e.preventDefault();
    setShowFilter(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = validate(formData);

    if (res.ok) update(res.data);
    else handleError(res);
  };

  const update = async (data?: DogSchemaData) => {
    setLoading(true);
    const nextData = { ...schemaData, ...data };
    const res = await fetchDogs(nextData);
    setSchemaData(nextData);
    handleResults(res);
  };

  return (
    <>
      {!loading && !dogs.length && <NoResults reset={update} />}

      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4, xl: 5 }} mb={60}>
        {loading
          ? placeholders.map((i) => <Skeleton key={i} w={240} h={260} />)
          : dogs.map((dog) => {
              const isFavorite = favorites.has(dog.id);
              return (
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  key={dog.id}
                >
                  <Card.Section pos="relative">
                    <Image src={dog.img} height={160} alt={dog.name} />
                    <ActionIcon
                      radius="xl"
                      size="md"
                      color="red"
                      variant="subtle"
                      aria-label="Save to favorites"
                      pos="absolute"
                      top={4}
                      right={4}
                      onClick={() =>
                        isFavorite
                          ? favorites.delete(dog.id)
                          : favorites.add(dog.id)
                      }
                    >
                      <IconHeart
                        style={{ width: "70%", height: "70%" }}
                        stroke={4}
                        fill={isFavorite ? "red" : "transparent"}
                      />
                    </ActionIcon>
                  </Card.Section>

                  <Stack gap={2} mt="md">
                    <Text size="sm">
                      Name:{" "}
                      <Text inherit component="span" c="dimmed">
                        {dog.name}
                      </Text>
                    </Text>
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
              );
            })}
      </SimpleGrid>

      <Filters
        onSubmit={handleFilter}
        opened={showFilter}
        onClose={() => setShowFilter(false)}
      />

      <Footer
        onFilterClick={() => setShowFilter(true)}
        total={Math.floor(total / limit) - 1}
        update={update}
      />
    </>
  );
}
