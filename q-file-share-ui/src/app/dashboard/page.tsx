"use client";

import styles from "./dashboard.module.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  SEND_FILE,
  SEND_FILES_TEXT,
  RECEIVED_FILES,
  RECEIVED_FILES_TEXT,
  SHARED_FILES,
  SHARED_FILES_TEXT,
} from "@/constants";
import { ActivityCard, Card, NavBar, INotification } from "@/modules";

import sendFileIcon from "@/assets/send-file-icon.svg";
import receivedFilesIcon from "@/assets/received-files-icon.svg";
import sharedFilesIcon from "@/assets/shared-files-icon.svg";

const Dashboard = (): JSX.Element => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  return (
    <>
      <NavBar showLogo={true} />
      <div className={styles.dashboardContainer}>
        <div className={styles.cardContainer}>
          <Card
            id="send-file-card"
            className={styles.card}
            src={sendFileIcon}
            title={SEND_FILE}
            description={SEND_FILES_TEXT}
            onClickHandler={() => {}}
          />
          <Card
            id="received-files-card"
            className={styles.card}
            src={receivedFilesIcon}
            title={RECEIVED_FILES}
            description={RECEIVED_FILES_TEXT}
            onClickHandler={() => {
              router.push("/received-files");
            }}
          />
          <Card
            id="shared-files-card"
            className={styles.card}
            src={sharedFilesIcon}
            title={SHARED_FILES}
            description={SHARED_FILES_TEXT}
            onClickHandler={() => {
              router.push("/shared-files");
            }}
          />
        </div>
        <div className={styles.activityContainer}>
          <ActivityCard notifications={notifications} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
