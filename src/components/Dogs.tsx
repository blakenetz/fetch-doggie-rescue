import { DogSchemaData, fetchDogs, validate } from "@/actions/dogs";
import DogData from "@/components/DogData";
import Filters, { FilterProps } from "@/components/Filters";
import Footer from "@/components/Footer";
import Match from "@/components/Match";
import NoResults from "@/components/NoResults";
import { AppContext } from "@/context/App";
import { Dog } from "@/types";
import {
  Card,
  Image,
  SimpleGrid,
  Skeleton,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

const placeholders = Array.from({ length: 16 }, (_el, i) => i);

export default function Dogs() {
  const ctx = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [total, setTotal] = useState(0);
  const [schemaData, setSchemaData] = useState<DogSchemaData>();

  const favorites = useSet<string>([]);

  async function fetchData(schema?: DogSchemaData) {
    fetchDogs(schema)
      .then(({ data, total }) => {
        setDogs(data);
        setTotal(total);
      })
      .catch(ctx.handleError)
      .finally(() => setLoading(false));
  }

  // fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter: FilterProps["onSubmit"] = async (e) => {
    e.preventDefault();
    setShowFilter(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = validate(formData);
      update(result);
    } catch (error) {
      ctx.handleError(error);
    }
  };

  const update = async (data?: DogSchemaData) => {
    setLoading(true);
    const schema = { ...schemaData, ...data };
    setSchemaData(schema);
    fetchData(schema);
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
                    <UnstyledButton
                      w="100%"
                      aria-label="Save to favorites"
                      onClick={() =>
                        isFavorite
                          ? favorites.delete(dog.id)
                          : favorites.add(dog.id)
                      }
                    >
                      <Image src={dog.img} height={160} alt={dog.name} />
                      <ThemeIcon
                        p={3}
                        radius="xl"
                        color="red"
                        variant="white"
                        pos="absolute"
                        top={4}
                        right={4}
                      >
                        {isFavorite ? <IconHeartFilled /> : <IconHeart />}
                      </ThemeIcon>
                    </UnstyledButton>
                  </Card.Section>

                  <DogData dog={dog} />
                </Card>
              );
            })}
      </SimpleGrid>

      <Filters
        onSubmit={handleFilter}
        opened={showFilter}
        onClose={() => setShowFilter(false)}
      />

      <Match
        favorites={Array.from(favorites.values())}
        opened={showMatch}
        onClose={() => setShowMatch(false)}
      />

      <Footer
        onFilterClick={() => setShowFilter(true)}
        onMatchClick={() => setShowMatch(true)}
        total={total}
        update={update}
      />
    </>
  );
}
