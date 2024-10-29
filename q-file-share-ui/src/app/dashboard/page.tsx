"use client";

import { NavBar } from "@/modules";
import receivedLogo from "../assets/received-logo.svg";
import sharedLogo from "../assets/shared-logo.svg";
import shareLogo from "../assets/share-logo.svg";
import React from 'react';
import type { StaticImageData } from 'next/image';
import Activity from "./activity";
import styles from "./dashboard.module.css";
import { useRouter } from 'next/navigation'; // Next.js router for the `app` directory

interface CardProps {
    title: string;
    description: string;
    logo: StaticImageData;
    route: string;
}

// Mark Card component as client-side only
const Card: React.FC<CardProps> = ({ title, description, logo, route }) => {
    const router = useRouter();

    return (
        <div className={styles.card} onClick={() => router.push(route)}>
            <img src={logo.src} alt={`${title} logo`} className={styles.cardLogo} />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const Dashboard: React.FC = () => {
    return (
        <>
            <NavBar showLogo={true} pageName="Dashboard" pageURL="/dashboard" />
            <div className={styles.dashboardContainer}>
                <div className={styles.cardContainer}>
                    <Card title="Share File" description="Securely share your files" logo={shareLogo} route="/share-file" />
                    <Card title="Received Files" description="View files you've received" logo={receivedLogo} route="/received-files" />
                    <Card title="Shared Files" description="Manage your shared files" logo={sharedLogo} route="/shared-files" />
                </div>
                <Activity />
            </div>
        </>
    );
};

export default Dashboard;
