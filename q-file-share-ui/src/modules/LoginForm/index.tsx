import styles from "./LoginForm.module.css";

import { Button } from "@/elements";

interface ILoginFormProps {}

export const LoginForm = (props: ILoginFormProps) => {
	return (
		<div>
			<div>
				<input id="email" type="email" />
			</div>
			<div>
				<input id="password" type="password" />
			</div>
			<Button type="submit" text={"Login"} />
		</div>
	);
};
