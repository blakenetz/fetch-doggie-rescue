import { Stack, Text, Title } from "@mantine/core";
import styles from "./App.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/Auth";
import LoginForm from "@/components/LoginForm";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Stack
      mih="100dvh"
      miw="100dvw"
      component="main"
      p={{ base: "xs", sm: "md" }}
      gap="xl"
      align="center"
    >
      <div className={styles.background} />
      <Title order={1} ta="center" fw={300}>
        <Text component="span" fw={900} inherit>
          Fetch!
        </Text>{" "}
        Dog Rescue
      </Title>

      {!authCtx.isAuthenticated ? <LoginForm /> : null}
    </Stack>
  );
}

export default App;
