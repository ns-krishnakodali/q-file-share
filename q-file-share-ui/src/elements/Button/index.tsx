import styles from "./Button.module.css";
import cx from "classnames";

interface IButtonProps {
	id: string;
	className?: string;
	text: String;
	type?: "submit" | "reset" | "button" | undefined;
	variant?: "primary" | "secondary" | "text";
	onClickAction: () => void;
}

export const Button = (props: IButtonProps) => {
	const {
		id,
		className,
		text,
		type = "button",
		variant = "primary",
		onClickAction
	} = props;

	return (
		<button
			id={id}
			className={cx(styles.button, styles[variant], className)}
			type={type}
			onClick={onClickAction}
		>
			{text}
		</button>
	);
};
