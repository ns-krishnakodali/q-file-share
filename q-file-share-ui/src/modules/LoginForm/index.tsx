import styles from "./LoginForm.module.css";

import { FormEvent } from "react";
import { useRouter } from "next/router";

import { Button, Input, Text } from "@/elements";
import { EMAIL, LOGIN, NEW_USER, PASSWORD, SIGN_UP } from "@/constants";

interface ILoginFormProps { }

export const LoginForm = (props: ILoginFormProps): JSX.Element => {
	const handleLoginSubmission = (event: FormEvent): void => {
		event.preventDefault();
	};

	return (
		<form className={styles.loginForm} onSubmit={handleLoginSubmission}>
			<div className={styles.loginFormElement}>
				<Input id="email" type="email" placeholder={EMAIL} />
			</div>
			<div className={styles.loginFormElement}>
				<Input id="password" type="password" placeholder={PASSWORD} />
			</div>
			<Button className={styles.loginButton} id="login-button" type="submit" variant="primary">
				{LOGIN}
			</Button>
			<div className={styles.signUpActions}>
				<Text size="small">{NEW_USER}</Text>
				<Button
					id="signup-text"
					className={styles.signUpButton}
					type="button"
					variant="text"
					onClickAction={() => {}}
				>
					{SIGN_UP}
				</Button>
			</div>
		</form>
	);
};
