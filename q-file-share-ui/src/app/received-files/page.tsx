"use client";

import styles from "./receivedFiled.module.css";

import { useState } from "react";

import { RECEIVED_FILES, SHARED_FILES } from "@/constants";
import { ListElement, ListHeader, ListModule, NavBar } from "@/modules";

const ReceivedFiles = (): JSX.Element => {
  const [receivedFiles, setReceivedFiles] = useState<ListElement[]>([]);

  return (
    <div className={styles.container}>
      <NavBar pageName1={SHARED_FILES} pageURL1="/shared-files" />
      <div className={styles.listContainer}>
        <ListHeader title={RECEIVED_FILES} />
        <ListModule elements={receivedFiles} />
      </div>
    </div>
  );
};

export default ReceivedFiles;
