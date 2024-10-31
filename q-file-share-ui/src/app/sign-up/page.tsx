"use client";

import styles from "./signup.module.css";

import Image from "next/image";

import { SIGN_UP } from "@/constants";
import { Heading } from "@/elements";
import { SignUpForm } from "@/modules";

import qfsLogo from '@/assets/qfs-logo.svg';

const SignUpPage = (): JSX.Element => {
	return (
		<div className={styles.container}>
			<div className={styles.logo}>
				<Image
					src={qfsLogo}
					alt="qfs-logo"
					width={120}
					height={120}
					priority
				/>
			</div>
			<div className={styles.signUpForm}>
				<Heading size={3}>{SIGN_UP}</Heading>
				<SignUpForm />
			</div>
		</div>
	);
};

export default SignUpPage;
