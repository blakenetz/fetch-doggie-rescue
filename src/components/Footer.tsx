import {
  DogSchemaData,
  SortDirection,
  sortDirections,
  SortField,
  sortFields,
} from "@/actions/dogs";
import { Button, Flex, Menu, Pagination } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useState } from "react";

export interface FooterProps {
  onFilterClick: () => void;
  total: number;
  update: (data?: DogSchemaData) => void;
}

export default function Footer({ onFilterClick, total, update }: FooterProps) {
  const [activePage, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(sortFields[0]);
  const [sortDirection, toggleSortDirection] =
    useToggle<SortDirection>(sortDirections);

  const icon =
    sortDirection === "asc" ? <IconSortAscending /> : <IconSortDescending />;

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

        <Button.Group>
          <Menu position="top-end">
            <Menu.Target>
              <Button variant="default">{`Sort By: ${sortField}`}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sort By</Menu.Label>
              {sortFields.map((field) => (
                <Menu.Item
                  key={field}
                  onClick={() => {
                    setSortField(field);
                    update({ sortField: field });
                  }}
                >
                  {field}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Button
            variant="default"
            aria-label="Sort Order"
            onClick={() => {
              update({
                sortDirection: sortDirection === "asc" ? "desc" : "asc",
              });
              toggleSortDirection();
            }}
          >
            {icon}
          </Button>
        </Button.Group>
      </Flex>
      <Pagination
        total={total}
        value={activePage}
        onChange={(value) => {
          update({ page: value });
          setPage(value);
        }}
      />
    </Flex>
  );
}
