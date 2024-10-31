import styles from "./SignUpForm.module.css";
import cx from "classnames";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button, Input, Text } from "@/elements";
import { ALREADY_JOINED, CONFIRM_PASSWORD, EMAIL, LOGIN, NAME, PASSWORD, SIGN_UP } from "@/constants";

import eyeShow from "@/assets/eye-show.svg";
import eyeHide from "@/assets/eye-hide.svg";

interface ISignUpFormProps { }

export const SignUpForm = (props: ISignUpFormProps): JSX.Element => {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);	

	const handleSignUpSubmission = (event: FormEvent): void => {
		event.preventDefault();
	};

	return (
		<form className={styles.signUpForm} onSubmit={handleSignUpSubmission}>
			<div className={cx(styles.name, styles.signUpFormElement)}>
				<Input id="first-name" type="text" placeholder={NAME} />
			</div>
			<div className={styles.signUpFormElement}>
				<Input id="email" type="email" placeholder={EMAIL}/>
			</div>
			<div className={cx(styles.signUpFormElement, styles.passwordContainer)}>
				<Input
					id="password"
					type={showPassword? "text": "password"}
					placeholder={PASSWORD}
				/>
				<Image
					src={showPassword ? eyeShow : eyeHide}
					alt="show-password"
					className={styles.showPasswordIcon}
					width={20}
					height={20}
					onClick={() => setShowPassword((showPassword) => !showPassword)}
				/>
			</div>
			<div className={cx(styles.signUpFormElement, styles.passwordContainer)}>
				<Input
					id="confirm-password"
					type={showConfirmPassword? "text": "password"}
					placeholder={CONFIRM_PASSWORD}
				/>
				<Image
					src={showConfirmPassword ? eyeShow : eyeHide}
					alt="show-confirm-password"
					className={styles.showPasswordIcon}
					width={20}
					height={20}
					onClick={() => setShowConfirmPassword((setShowConfirmPassword) => !setShowConfirmPassword)}
				/>
			</div>
			<Button className={styles.signUpButton} id="sign-up-button" type="submit" variant="primary">
				{SIGN_UP}
			</Button>
			<div className={styles.loginActions}>
				<Text size="small">{ALREADY_JOINED}</Text>
				<Button
					id="signup-text"
					className={styles.loginButton}
					type="button"
					variant="text"
					onClickAction={() => {router.push("/login")}}
				>
					{LOGIN}
				</Button>
			</div>
		</form>
	);
};
