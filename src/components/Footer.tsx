import { DogSchemaData } from "@/actions/dogs";
import { ActionIcon, Flex, Menu, Pagination, Button } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
      gap="md"
    >
      <Flex gap="sm">
        <Button onClick={onFilterClick}>Filters</Button>
        <Flex align="center" gap="xs">
          <Menu position="top-start">
            <Menu.Target>
              <Button variant="subtle">Sort</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sort By</Menu.Label>
              <Menu.Item>Breed</Menu.Item>
              <Menu.Item>Name</Menu.Item>
              <Menu.Item>Age</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ActionIcon
            variant="subtle"
            aria-label="Sort Order"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            {sortDirection === "asc" ? (
              <IconSortDescending />
            ) : (
              <IconSortAscending />
            )}
          </ActionIcon>
        </Flex>
      </Flex>
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
