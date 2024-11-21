"use client";

import styles from "./login.module.css";

import Image from "next/image";

import { LOGIN } from "@/constants";
import { Heading } from "@/elements";
import { LoginForm, Notification } from "@/modules";

import qfsLogo from "@/assets/qfs-logo.svg";

const LoginPage = (): JSX.Element => {
  const handleLoginDetails = (email: string | undefined, password: string | undefined): void => {
    
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={qfsLogo} alt="qfs-logo" width={120} height={120} priority />
      </div>
      <div className={styles.loginForm}>
        <Heading size={3}>{LOGIN}</Heading>
        <LoginForm handleLoginDetails={handleLoginDetails}/>
      </div>
    </div>
  );
};

export default LoginPage;
