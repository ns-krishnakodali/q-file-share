"use client";

import styles from "./SendFile.module.css";

import { useEffect } from "react";

import { RECEIVED_FILES, SHARED_FILES } from "@/constants";
import { NavBar, SendFileOptions, UploadFile } from "@/modules";
import { axiosInstance } from "@/utils";
import { cpaEncrypt } from "@/quantum-protocols";

const SendFile = (): JSX.Element => {
  useEffect(() => {}, []);

  const handleFilesUpload = (files: File[]) => {};

  const handleFileSubmission = async (
    recipientEmail: string,
    expiration: string,
    downloadCount: string,
    checkAnonymous: boolean,
  ) => {
    const response = await axiosInstance.get("/file/test");
    const t  = response.data?.t;
    const seed = response.data?.seed;

    const uv = cpaEncrypt(t, seed);

    await axiosInstance.post("/file/test1", {
      u: uv[0],
      v: uv[1]
    })
  };

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
