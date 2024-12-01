"use client";

import styles from "./SendFile.module.css";

import { useEffect } from "react";

import { NavBar, SendFileOptions, UploadFile } from "@/modules";
import { RECEIVED_FILES, SHARED_FILES } from "@/constants";

const SendFile = (): JSX.Element => {
  useEffect(() => {}, []);

  const handleFilesUpload = (files: File[]) => {};

  const handleFileSubmission = async (
    recipientEmail: string,
    expiration: string,
    downloadCount: string,
    checkAnonymous: boolean,
  ) => {};

  return (
    <>
      <NavBar
        pageName1={SHARED_FILES}
        pageURL1="/shared-files"
        pageName2={RECEIVED_FILES}
        pageURL2="/received-files"
      />
      <div className={styles.container}>
        <div className={styles.uploadFile}>
          <UploadFile onUpload={handleFilesUpload} />
        </div>
        <div className={styles.sendFileOptions}>
          <SendFileOptions handleFileSubmission={handleFileSubmission} />
        </div>
      </div>
    </>
  );
};

export default SendFile;
