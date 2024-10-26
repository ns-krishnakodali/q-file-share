import styles from "./LoginForm.module.css";

import { Button, Input } from "@/elements";

interface ILoginFormProps {}

export const LoginForm = (props: ILoginFormProps): JSX.Element => {
	const onClickFunction = (): void => {};

	return (
		<div>
			<div>
				<Input id="email" type="email" placeholder="Email"/>
			</div>
			<div>
				<Input id="password" type="password" placeholder="Password"/>
			</div>
			<Button id="login-button" type="submit" variant="primary" text={"Login"} onClickAction={onClickFunction}/>
		</div>
	);
};
