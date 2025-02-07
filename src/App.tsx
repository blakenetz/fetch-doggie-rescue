import Dogs from "@/components/Dogs";
import LoginForm from "@/components/LoginForm";
import { AppContext } from "@/context/App";
import { Alert, Divider, Flex, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import styles from "./App.module.css";

function App() {
  const { errorMsg, isAuthenticated, clearErrorMsg } = useContext(AppContext);

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

      {errorMsg && (
        <Alert
          variant="light"
          color="red"
          title="Oh no! We ran into an issue"
          onClose={clearErrorMsg}
          withCloseButton
        >
          <Flex gap="xs" align="center">
            {errorMsg.status && (
              <>
                <Text c="red.9">{errorMsg.status}</Text>
                <Divider orientation="vertical" color="gray.9" />
              </>
            )}
            <Text>{errorMsg.message}</Text>
          </Flex>
        </Alert>
      )}

      <Title order={1} ta="center" fw={300}>
        <Text component="span" fw={900} inherit>
          Fetch!
        </Text>{" "}
        Dog Rescue
      </Title>

      {!isAuthenticated ? <LoginForm /> : <Dogs />}
    </Stack>
  );
}

export default App;
