"use client";

import styles from "./sharedFiles.module.css";

import { useState } from "react";

import { RECEIVED_FILES, SHARED_FILES } from "@/constants";
import { ListElement, ListHeader, ListModule, NavBar } from "@/modules";

const SharedFiles = (): JSX.Element => {
  const [sharedFiles, setSharedFiles] = useState<ListElement[]>([]);

  return (
    <div className={styles.container}>
      <NavBar pageName1={RECEIVED_FILES} pageURL1="/received-files" />
      <div className={styles.listContainer}>
        <ListHeader title={SHARED_FILES} />
        <ListModule elements={sharedFiles} renderSendFilesLayout />
      </div>
    </div>
  );
};

export default SharedFiles;
