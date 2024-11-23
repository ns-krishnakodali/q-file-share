"use client";

import styles from "./signup.module.css";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Heading } from "@/elements";
import { SignUpForm } from "@/modules";
import { axiosInstance } from "@/utils";
import { useNotification } from "@/context";
import {
  PASSWORD_MATCH_ERROR,
  SIGN_UP,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESSFUL,
} from "@/constants";

import qfsLogo from "@/assets/qfs-logo.svg";

const SignUpPage = (): JSX.Element => {
  const [displayLoader, setDisplayLoader] = useState<boolean>(false);

  const router = useRouter();
  const { addNotification } = useNotification();

  const handleSignUpSubmission = async (
    name?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
  ): Promise<void> => {
    if (password !== confirmPassword) {
      addNotification({
        type: "error",
        message: PASSWORD_MATCH_ERROR,
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/auth/sign-up",
        {
          name,
          email,
          password,
        },
        { headers: { skipAuth: true } },
      );

      if (response?.status === 201) {
        addNotification({ type: "success", message: SIGNUP_SUCCESSFUL });
        setDisplayLoader(true);
        router.push("/login");
      }
    } catch (error) {
      addNotification({ type: "error", message: SIGNUP_FAILURE });
      setDisplayLoader(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={qfsLogo} alt="qfs-logo" width={120} height={120} priority />
      </div>
      <div className={styles.signUpForm}>
        <Heading size={3}>{SIGN_UP}</Heading>
        <SignUpForm
          displayLoader={displayLoader}
          handleSignUpSubmission={handleSignUpSubmission}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
