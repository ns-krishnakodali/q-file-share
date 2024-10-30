"use client";

import styles from "./dashboard.module.css"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ActivityCard, Card, NavBar, INotification } from "@/modules";
import { SEND_FILE, RECEIVED_FILES, SHARED_FILES } from "@/constants";

import sendFileIcon from "@/assets/send-file-icon.svg";
import receivedFilesIcon from "@/assets/received-files-icon.svg";
import sharedFilesIcon from "@/assets/shared-files-icon.svg";


const Dashboard: React.FC = (): JSX.Element => {

  const router = useRouter();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  return (
    <>
      <NavBar showLogo={true}/>
      <div className={styles.dashboardContainer}>
        <div className={styles.cardContainer}>
          <Card
            id="share-file-card"
            className={styles.card}
            src={sendFileIcon}
            title={SEND_FILE}
            description="Securely share your files"
            onClickHandler={() => {}}
          />
          <Card
            id="received-files-card"
            className={styles.card}
            src={receivedFilesIcon}
            title={RECEIVED_FILES}
            description="View files you've received"
            onClickHandler={() => {}}
          />
          <Card
            id="transferred-files-card"
            className={styles.card}
            src={sharedFilesIcon}
            title={SHARED_FILES}
            description="Manage your shared files"
            onClickHandler={() => {}}
          />
        </div>
        <div className={styles.activityContainer}>
          <ActivityCard notifications={notifications}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
