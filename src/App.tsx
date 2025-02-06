import { Box } from "@mantine/core";
import styles from "./App.module.css";

function App() {
  return (
    <Box mih="100dvh" miw="100dvw" component="main">
      <div className={styles.background} />
    </Box>
  );
}

export default App;
