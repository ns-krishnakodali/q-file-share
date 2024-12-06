import { Cipher, createCipheriv, randomBytes } from "crypto";

import { INVALID_ENCRYPTION_KEY_ERROR, MAX_FILE_BYTES } from "@/constants";
import { IActivity, IListElement } from "@/modules";
import {
  DLSecretKey,
  DLSignature,
  signWithDilithium,
} from "@/quantum-protocols";

import { getActivityTypeMessage, getDateFromISOFormat } from "../string-utils";

export const getFileSize = (fileSize: number) => {
  const sizeInKB = fileSize / 1024;
  return sizeInKB < 1000
    ? `${sizeInKB.toFixed(2)} KB`
    : `${(sizeInKB / 1024).toFixed(2)} MB`;
};

export const getFileActivities = (activities: any[]): IActivity[] =>
  activities?.map((activity: any) => ({
    message: `${getActivityTypeMessage(activity["type"])} ${activity["email"]}`,
    type: activity["type"],
  }));

export const getFileSRDetails = (
  fileDetails: any[],
  transceive: string,
  transactionDate: string,
): IListElement[] =>
  fileDetails?.map((fileDetail: any) => ({
    fileId: fileDetail?.file_id,
    name: fileDetail?.name,
    size: fileDetail?.size,
    expiry: fileDetail?.expiry,
    downloads: fileDetail?.download_count,
    transceive: fileDetail?.[transceive],
    transactionDate: fileDetail?.[transactionDate],
  }));

export const signEncryptAndProcessFile = async (
  file: File,
  dlSecretKey: DLSecretKey,
  kyberKey: number[],
): Promise<{
  initVector: string;
  encryptedFileBuffer: Buffer;
  fileSignature?: DLSignature;
  fileName: string;
  fileSize: number;
  fileType: string;
}> => {
  let fileSignature: DLSignature | undefined;

  const fileReadPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        resolve(event.target.result as ArrayBuffer);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });

  const arrayBuffer = await fileReadPromise;

  const byteLength: number = Math.min(MAX_FILE_BYTES, arrayBuffer.byteLength);
  fileSignature = signWithDilithium(
    dlSecretKey,
    new Uint8Array(arrayBuffer, 0, byteLength),
  );

  const encryptedData = await encryptFile(file, kyberKey);

  return {
    ...encryptedData,
    fileSignature,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };
};

const encryptFile = async (
  file: File,
  key: number[],
): Promise<{
  initVector: string;
  encryptedFileBuffer: Buffer;
}> => {
  if (key.length !== 256 || !key.every((bit) => bit === 0 || bit === 1)) {
    throw new Error(INVALID_ENCRYPTION_KEY_ERROR);
  }

  const byteKey: Uint8Array = new Uint8Array(
    Array.from({ length: 24 }, (_, i) =>
      parseInt(key.slice(i * 8, i * 8 + 8).join(""), 2),
    ),
  );

  const initVector: Buffer = randomBytes(16);
  const fileContent: ArrayBuffer = await file.arrayBuffer();

  const bufferContent: Buffer = Buffer.from(fileContent);

  const cipher: Cipher = createCipheriv("aes-192-cbc", byteKey, initVector);
  const encryptedFileBuffer: Buffer = Buffer.concat([
    cipher.update(bufferContent),
    cipher.final(),
  ]);

  return {
    initVector: initVector.toString("base64"),
    encryptedFileBuffer,
  };
};
