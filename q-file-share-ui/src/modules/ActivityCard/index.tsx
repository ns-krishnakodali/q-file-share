import styles from "./ActivityCard.module.css";
import cx from "classnames";

import Image from "next/image";

import { ACTIVITY } from "@/constants";
import { Heading, Text } from "@/elements";

import closeIcon from "@/assets/close-icon.svg";
import sentIcon from "@/assets/sent-icon.svg";
import receivedIcon from "@/assets/received-icon.svg";

export interface INotification {
  message: string;
  type: "receive" | "send";
}

interface IActivityProps {
  className?: string;
  notifications: INotification[];
}

export const ActivityCard = (props: IActivityProps): JSX.Element => {
  const { className = "", notifications } = props;

  const handleCloseActivity = (): void => {};

  const openActivityHandler = (index: number): void => {};

  return (
    <div className={cx(styles.activityCard, className)}>
      <div className={styles.heading}>
        <Heading size={2}>{ACTIVITY}</Heading>
      </div>
      <div className={styles.activityElementContainer}>
        <ul className={styles.activityElementList}>
          {notifications.map((notification: INotification, index: number) => (
            <li
              className={styles.activityElement}
              key={index}
              onClick={() => openActivityHandler(index)}
            >
              <Image
                src={notification.type === "send" ? sentIcon : receivedIcon}
                className={styles.notificationIcon}
                alt={`${notification?.type}-icon`}
                width={20}
                height={20}
              />
              <Text>{notification?.message || ""}</Text>
              <Image
                src={closeIcon}
                className={styles.closeIcon}
                alt="close-icon"
                width={20}
                height={20}
                onClick={handleCloseActivity}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
