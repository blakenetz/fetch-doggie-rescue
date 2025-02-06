import Dogs from "@/components/Dogs";
import LoginForm from "@/components/LoginForm";
import { AuthContext } from "@/context/Auth";
import { Alert, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import styles from "./App.module.css";
import { AppContext } from "@/context/App";

function App() {
  const authCtx = useContext(AuthContext);
  const appCtx = useContext(AppContext);

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

      {appCtx.errorMsg && (
        <Alert
          variant="light"
          color="red"
          title="Oh no! We ran into an issue"
          onClose={() => appCtx.setErrorMsg("")}
          withCloseButton
        >
          {appCtx.errorMsg}
        </Alert>
      )}

      <Title order={1} ta="center" fw={300}>
        <Text component="span" fw={900} inherit>
          Fetch!
        </Text>{" "}
        Dog Rescue
      </Title>

      {!authCtx.isAuthenticated ? <LoginForm /> : <Dogs />}
    </Stack>
  );
}

export default App;
