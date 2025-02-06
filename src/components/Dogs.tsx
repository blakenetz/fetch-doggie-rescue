import { fetchDogs } from "@/actions/dogs";
import { Dog } from "@/types";
import { Card, Image, SimpleGrid, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/Auth";
import { AppContext } from "@/context/App";

export default function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchDogs();

      if (res.ok) setDogs(res.data);
      else {
        if (res.status === 401) authCtx.logout();
        else {
          console.error("Error fetching doggos", res);
          appCtx.setErrorMsg(res.message ?? "An unexpected error occurred.");
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 4, xl: 5 }}>
      {dogs.map((dog) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder key={dog.id}>
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
  );
}
