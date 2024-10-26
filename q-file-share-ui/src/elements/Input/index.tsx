import styles from "./Input.module.css";
import cx from "classnames";

interface IInputProps {
  className?: string;
  id: string;
  text?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  isReadOnly?: boolean;
  onClickAction?: () => void;
}

export const Input = (props: IInputProps) => {
  const {
    className,
    id,
    text,
    type = "text",
    placeholder = "",
    isReadOnly = false,
    onClickAction
  } = props;

  return (
    <input
      id={id}
      className={cx(styles.input, className)}
      type={type}
      placeholder={placeholder}
      readOnly={isReadOnly}
      onClick={onClickAction}
    />
  );
};
