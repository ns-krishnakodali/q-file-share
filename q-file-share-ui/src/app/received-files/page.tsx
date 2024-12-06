"use client";

import styles from "./receivedFiled.module.css";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  GENERIC_ERROR_MESSAGE,
  RECEIVED_FILES,
  SEND_FILES,
  SESSION_EXPIRED_MESSAGE,
  SHARED_FILES,
  UNTITLED_FILE,
} from "@/constants";
import { useNotification } from "@/context";
import { Loader } from "@/elements";
import { IListElement, ListHeader, ListModule, NavBar } from "@/modules";
import {
  axiosInstance,
  downloadFile,
  getAuthToken,
  getFileSRDetails,
  isValidToken,
  removeAuthToken,
  stringifyKyberKeyPair,
} from "@/utils";
import { generateKyberKeyPair, KyberKeyPair } from "@/quantum-protocols";

const ReceivedFiles = (): JSX.Element => {
  const router = useRouter();

  const { addNotification } = useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [receivedFiles, setReceivedFiles] = useState<IListElement[]>([]);

  useEffect(() => {
    const getReceivedFiles = async (): Promise<void> => {
      if (!isValidToken()) {
        await router.replace("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/file/received-files", {
          headers: {
            Authorization: getAuthToken(),
          },
        });
        if (response?.status === 200) {
          const fileDetails: IListElement[] = getFileSRDetails(
            response.data?.receivedFiles,
            "received_from",
            "received_on",
          );
          if (typeof fileDetails !== "undefined") setReceivedFiles(fileDetails);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          addNotification({ message: SESSION_EXPIRED_MESSAGE, type: "warn" });
          removeAuthToken();
          await router.replace("/login");
        } else {
          setReceivedFiles([]);
          addNotification({
            type: "error",
            message: error?.response?.data?.detail || GENERIC_ERROR_MESSAGE,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    getReceivedFiles();
  }, []);

  const fileDownloadHandler = async (fileId: string, fileName?: string) => {
    const kyberKeyPair: KyberKeyPair = generateKyberKeyPair();

    try {
      const response = await axiosInstance.post(
        "/file/download",
        {
          file_id: fileId,
          kyber_key_pair: stringifyKyberKeyPair(kyberKeyPair),
        },
        {
          headers: {
            Authorization: getAuthToken(),
          },
          responseType: "blob",
        },
      );
      downloadFile(response?.data, fileName || UNTITLED_FILE);
    } catch (error) {
      console.log(error);
      addNotification({ message: "", type: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <NavBar
        pageName1={SEND_FILES}
        pageName2={SHARED_FILES}
        pageURL1="/send-files"
        pageURL2="/shared-files"
      />
      <div className={styles.listContainer}>
        {isLoading ? (
          <Loader isStatic />
        ) : (
          <>
            <ListHeader title={RECEIVED_FILES} />
            <ListModule
              elements={receivedFiles}
              fileDownloadHandler={fileDownloadHandler}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ReceivedFiles;
