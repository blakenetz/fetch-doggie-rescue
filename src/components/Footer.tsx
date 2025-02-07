import {
  DogSchemaData,
  limit,
  SortDirection,
  sortDirections,
  SortField,
  sortFields,
} from "@/actions/dogs";
import { capitalize } from "@/utils";
import { Button, Divider, Flex, Menu, Pagination } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconHeart,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useState } from "react";

export interface FooterProps {
  onFilterClick: () => void;
  onMatchClick: () => void;
  total: number;
  update: (data?: DogSchemaData) => void;
}

export default function Footer({
  onFilterClick,
  onMatchClick,
  total,
  update,
}: FooterProps) {
  const [activePage, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(sortFields[0]);
  const [sortDirection, toggleSortDirection] =
    useToggle<SortDirection>(sortDirections);

  const icon =
    sortDirection === "asc" ? <IconSortAscending /> : <IconSortDescending />;

  return (
    <Flex
      component="footer"
      wrap="wrap"
      pos="fixed"
      bottom={0}
      left={0}
      w="100%"
      justify="space-between"
      bg="white"
      p="xs"
      gap="md"
    >
      <Flex gap="xs">
        <Button onClick={onFilterClick} size="xs">
          Filters
        </Button>

        <Button.Group>
          <Menu width="target">
            <Menu.Target>
              <Button variant="default" size="xs">{`Sort By: ${capitalize(
                sortField
              )}`}</Button>
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
                  {capitalize(field)}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Button
            size="xs"
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

        <Button
          size="xs"
          variant="subtle"
          color="red"
          rightSection={<IconHeart size={16} />}
          onClick={onMatchClick}
        >
          See Match
        </Button>
      </Flex>

      <Pagination
        total={Math.floor(total / limit) - 1}
        value={activePage}
        onChange={(value) => {
          update({ page: value });
          setPage(value);
        }}
        hideWithOnePage
        size="sm"
      />
    </Flex>
  );
}
