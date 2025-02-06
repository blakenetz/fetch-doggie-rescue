import { Box, Text, Title } from "@mantine/core";
import styles from "./App.module.css";

function App() {
  return (
    <Box
      mih="100dvh"
      miw="100dvw"
      component="main"
      p={{ base: "xs", sm: "md" }}
    >
      <div className={styles.background} />
      <Title order={1} ta="center" fw={300}>
        <Text component="span" fw={900} inherit>
          Fetch!
        </Text>{" "}
        Dog Rescue
      </Title>
    </Box>
  );
}

export default App;
