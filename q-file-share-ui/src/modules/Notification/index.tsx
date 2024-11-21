import styles from "./Notification.module.css";
import cx from "classnames";

import closeIcon from "@/assets/close-icon.svg";
import Image from "next/image";

export interface INotificationProps {
  message: string;
  type?: "success" | "error" | "warn" | "info";
  onCloseHandler?: () => void;
}

export const Notification = (props: INotificationProps) => {
  const { message, type = "info", onCloseHandler } = props;
  
  return (
    <div className={cx(styles.notification, styles[type])}>
      <div className={styles.message}>{message}</div>
      <Image
        src={closeIcon}
        className={styles.closeIcon}
        alt="close-icon"
        width={20}
        height={20}
        onClick={onCloseHandler}
      />
    </div>
  );
};
