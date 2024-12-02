export const getFileSize = (fileSize: number) => {
  const sizeInKB = fileSize / 1024;
  return sizeInKB < 1000
    ? `${sizeInKB.toFixed(2)} KB`
    : `${(sizeInKB / 1024).toFixed(2)} MB`;
};
