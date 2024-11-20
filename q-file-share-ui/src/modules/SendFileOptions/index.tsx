import styles from "./SendFileOptions.module.css";

import { FormEvent, useRef } from "react";

import { Button, Input } from "@/elements";
import {
  DOWNLOAD_COUNT,
  EXPIRATION,
  RECIPIENT_EMAIL,
  SEND_ANONYMOUSLY,
  SHARE,
} from "@/constants";

interface ISendFileOptionsProps {
  handleFileSubmission: (
    recipientEmail: string,
    expiration: string,
    downloadCount: string,
    checkAnonymous: boolean,
  ) => void;
}

export const SendFileOptions = (props: ISendFileOptionsProps): JSX.Element => {
  const { handleFileSubmission } = props;

  const recipientEmailRef = useRef<HTMLInputElement>(null);
  const expirationRef = useRef<HTMLInputElement>(null);
  const downloadCountRef = useRef<HTMLInputElement>(null);
  const checkAnonymousRef = useRef<HTMLInputElement>(null);

  const handleSubmission = (event: FormEvent): void => {
    event.preventDefault();

    const recipientEmail: string = recipientEmailRef.current?.value || "";
    const expiration: string = expirationRef.current?.value || "";
    const downloadCount: string = downloadCountRef.current?.value || "";
    const checkAnonymous: boolean = checkAnonymousRef.current?.checked || false;

    handleFileSubmission(recipientEmail, expiration, downloadCount, checkAnonymous);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmission}>
      <div className={styles.inputContainer}>
        <div className={styles.inputFieldContainer}>
        <Input
          id="recipient-email"
          className={styles.inputElement}
          ref={expirationRef}
          type="email"
          placeholder={RECIPIENT_EMAIL}
        />
        <Input
          id="expiration-days"
          className={styles.inputElement}
          ref={expirationRef}
          type="text"
          placeholder={EXPIRATION}
        />
        <Input
          id="download-count"
          className={styles.inputElement}
          ref={downloadCountRef}
          type="text"
          placeholder={DOWNLOAD_COUNT}
        />
        </div>
        <Input
          id="check-anonymous"
          className={styles.inputElement}
          ref={checkAnonymousRef}
          type="checkbox"
          placeholder={SEND_ANONYMOUSLY}
        />
      </div>
      
      <Button id="share-button" type="submit">
        {SHARE}
      </Button>
    </form>
  );
};
