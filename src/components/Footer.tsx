import { Button, Flex, Pagination } from "@mantine/core";

export interface FooterProps {
  onFilterClick: () => void;
}

export default function Footer({ onFilterClick }: FooterProps) {
  return (
    <Flex
      component="footer"
      pos="fixed"
      bottom={0}
      left={0}
      w="100%"
      justify="space-between"
      bg="white"
      p="xs"
    >
      <Button onClick={onFilterClick}>Filters</Button>
      <Pagination total={10} />
    </Flex>
  );
}
