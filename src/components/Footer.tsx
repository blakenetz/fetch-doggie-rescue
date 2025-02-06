import { DogSchemaData } from "@/actions/dogs";
import { Button, Flex, Pagination } from "@mantine/core";
import { useState } from "react";

export interface FooterProps {
  onFilterClick: () => void;
  total: number;
  onPageChange: (data?: DogSchemaData) => void;
}

export default function Footer({
  onFilterClick,
  total,
  onPageChange,
}: FooterProps) {
  const [activePage, setPage] = useState(1);

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
      <Pagination
        total={total}
        value={activePage}
        onChange={(value) => {
          onPageChange({ page: value });
          setPage(value);
        }}
      />
    </Flex>
  );
}
