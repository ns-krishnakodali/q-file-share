"use client";

import styles from "./signup.module.css";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Heading } from "@/elements";
import { SignUpForm } from "@/modules";
import { hashPassword } from "@/utils";
import { useNotification } from "@/context";
import {
  PASSWORD_HASH_ERROR,
  PASSWORD_MATCH_ERROR,
  SIGN_UP,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESSFUL,
} from "@/constants";

import qfsLogo from "@/assets/qfs-logo.svg";

const SignUpPage = (): JSX.Element => {
  const { addNotification } = useNotification();

  const router = useRouter();

  const sendPostRequest = async (
    username?: string,
    email?: string,
    password?: string,
  ) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/sign-up", {
        username,
        email,
        password,
      });
      if (response?.status === 201) {
        addNotification({ type: "success", message: SIGNUP_SUCCESSFUL });
        router.push("/login");
      }
    } catch (err) {
      addNotification({ type: "error", message: SIGNUP_FAILURE });
    }
  };

  const handleSignUpSubmission = async (
    name?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
  ) => {
    if (password !== confirmPassword) {
      addNotification({
        type: "error",
        message: PASSWORD_MATCH_ERROR,
      });
      return;
    }

    try {
      const hashedPassword: string = hashPassword(password || "");
      sendPostRequest(name, email, hashedPassword);
    } catch (error) {
      addNotification({
        type: "error",
        message: PASSWORD_HASH_ERROR,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={qfsLogo} alt="qfs-logo" width={120} height={120} priority />
      </div>
      <div className={styles.signUpForm}>
        <Heading size={3}>{SIGN_UP}</Heading>
        <SignUpForm handleSignUpSubmission={handleSignUpSubmission} />
      </div>
    </div>
  );
};

export default SignUpPage;
