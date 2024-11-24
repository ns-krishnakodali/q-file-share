import styles from "./ActivityCard.module.css";
import cx from "classnames";

import Image from "next/image";

import { ACTIVITY } from "@/constants";
import { Heading, Text } from "@/elements";

import closeIcon from "@/assets/close-icon.svg";
import sentIcon from "@/assets/sent-icon.svg";
import receivedIcon from "@/assets/received-icon.svg";

export interface IActivity {
  message: string;
  type: "receive" | "send";
}

interface IActivityProps {
  className?: string;
  activities: IActivity[];
}

export const ActivityCard = (props: IActivityProps): JSX.Element => {
  const { className = "", activities } = props;

  const handleCloseActivity = (): void => {};

  const openActivityHandler = (index: number): void => {};

  return (
    <div className={cx(styles.activityCard, className)}>
      <div className={styles.heading}>
        <Heading size={2}>{ACTIVITY}</Heading>
      </div>
      <div className={styles.activityElementContainer}>
        <ul className={styles.activityElementList}>
          {activities.map((activity: IActivity, index: number) => (
            <li
              className={styles.activityElement}
              key={index}
              onClick={() => openActivityHandler(index)}
            >
              <Image
                src={activity.type === "send" ? sentIcon : receivedIcon}
                className={styles.notificationIcon}
                alt={`${activity?.type}-icon`}
                width={20}
                height={20}
              />
              <Text>{activity?.message || ""}</Text>
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
