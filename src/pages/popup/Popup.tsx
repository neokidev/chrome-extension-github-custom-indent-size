import React, { ChangeEvent, useEffect, useState } from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";
import {
  Center,
  Container,
  Group,
  Header,
  NumberInput,
  Text,
} from "@mantine/core";

const Popup = () => {
  const [tabSize, setTabSize] = useState(8);
  const [spaceSize, setSpaceSize] = useState(4);

  const onChangeTabSize = (value: number | "") => {
    if (value !== "") {
      setTabSize(value);
      chrome.storage.sync.set({
        tabSize: value,
      });
    }
  };

  const onChangeSpaceSize = (value: number | "") => {
    if (value !== "") {
      setSpaceSize(value);
      chrome.storage.sync.set({
        spaceSize: value,
      });
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(
      {
        tabSize: 8,
        spaceSize: 4,
      },
      (items) => {
        setTabSize(items.tabSize);
        setSpaceSize(items.spaceSize);
      }
    );
  }, []);

  return (
    <>
      <Header
        height={undefined}
        p="xs"
        style={{ color: "#cdd9e5", backgroundColor: "#2d333b" }}
      >
        <Center h="fit-content">
          <Text fw={700}>GitHub Custom Tab Size</Text>
        </Center>
      </Header>
      <Container>
        <Group grow>
          <NumberInput
            value={tabSize}
            label="Tab size"
            onChange={onChangeTabSize}
            min={1}
            max={8}
          />
          <NumberInput
            value={spaceSize}
            label="Space size"
            onChange={onChangeSpaceSize}
            min={1}
            max={8}
          />
        </Group>
      </Container>
    </>
  );
};

export default Popup;
