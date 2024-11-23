"use client";

import styles from "./login.module.css";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Heading } from "@/elements";
import { LoginForm } from "@/modules";
import { useNotification } from "@/context";
import { LOGIN, LOGIN_FAILURE } from "@/constants";
import { axiosInstance, setAuthToken } from "@/utils";

import qfsLogo from "@/assets/qfs-logo.svg";

const LoginPage = (): JSX.Element => {
  const [displayLoader, setDisplayLoader] = useState<boolean>(false);

  const router = useRouter();
  const { addNotification } = useNotification();

  const handleLoginSubmission = async (
    email?: string,
    password?: string,
  ): Promise<void> => {
    setDisplayLoader(true);
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { headers: { skipAuth: true } },
      );
      if (response.status === 200) {
        setAuthToken(response.data?.token);
        router.replace("/dashboard");
      }
    } catch (error: any) {
      setDisplayLoader(false);
      addNotification({
        type: "error",
        message: error?.response?.data?.detail || LOGIN_FAILURE,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={qfsLogo} alt="qfs-logo" width={120} height={120} priority />
      </div>
      <div className={styles.loginForm}>
        <Heading size={3}>{LOGIN}</Heading>
        <LoginForm
          displayLoader={displayLoader}
          handleLoginSubmission={handleLoginSubmission}
        />
      </div>
    </div>
  );
};

export default LoginPage;
