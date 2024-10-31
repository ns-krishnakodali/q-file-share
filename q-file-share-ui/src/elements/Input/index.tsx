import styles from "./Input.module.css";
import cx from "classnames";

interface IInputProps {
  id: string;
  className?: string;
  name?: string;
  type?: "text" | "email" | "password";
  value?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  onClickAction?: () => void;
}

export const Input = (props: IInputProps): JSX.Element => {
  const {
    id,
    className,
    name = "",
    type = "text",
    value,
    placeholder = "",
    isReadOnly = false,
    onClickAction,
  } = props;

  return (
    <input
      id={id}
      name={name}
      className={cx(styles.input, className)}
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={isReadOnly}
      onClick={onClickAction}
    />
  );
};
