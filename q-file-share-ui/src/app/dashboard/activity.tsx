import React from 'react';
import styles from "./dashboard.module.css";

const Activity: React.FC = () => {
    const notifications = [
        "Received a file from abc@gmail.com (NEW)",
        "Sent a file to xyz.com successfully",
        "File abc123.pdf has been downloaded 2 times",
    ];

    return (
        <div className={styles.activityCard}>
            <h3>Activity</h3>
            <ul>
                {notifications.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </div>
    );
};

export default Activity;
