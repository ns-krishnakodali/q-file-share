import styles from "./Button.module.css";

interface IButtonProps {
	type?: "submit" | "reset" | "button" | undefined;
	text: String;
}

export const Button = (props: IButtonProps) => {
	const { type = "button", text } = props;

	return (<button type={type}>{text}</button>);
};
