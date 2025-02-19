import { fetchMatch } from "@/actions/dogs";
import DogData from "@/components/DogData";
import { AppContext } from "@/context/App";
import { Dog } from "@/types/dogs";
import {
  Center,
  Divider,
  Flex,
  Image,
  Loader,
  Modal,
  ModalProps,
  Stack,
  Text,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";

export interface MatchProps extends ModalProps {
  favorites: string[];
}
interface ModalContentProps {
  favorites: string[];
  match?: Dog;
}

function ModalContent({ favorites, match }: ModalContentProps) {
  if (favorites.length < 2) {
    return (
      <Stack>
        <Text fw={500}>Not enough favorites</Text>
        <Text>Please select at least 2 dogs to see a match</Text>
      </Stack>
    );
  }

  if (match)
    return (
      <Flex gap="sm">
        <Image src={match.img} w="40%" />
        <DogData dog={match} />
      </Flex>
    );
  return (
    <Center>
      <Loader />
    </Center>
  );
}

export default function Match({ favorites, opened, ...props }: MatchProps) {
  const ctx = useContext(AppContext);

  const [match, setMatch] = useState<Dog>();

  useEffect(() => {
    if (opened && favorites.length > 1) {
      fetchMatch(favorites).then(setMatch).catch(ctx.handleError);
    }
    return () => setMatch(undefined);
  }, [opened, favorites]);

  return (
    <Modal
      title="Here's your match!"
      centered
      opened={opened}
      size="xl"
      {...props}
    >
      <Divider mb="sm" />
      <ModalContent favorites={favorites} match={match} />
    </Modal>
  );
}
