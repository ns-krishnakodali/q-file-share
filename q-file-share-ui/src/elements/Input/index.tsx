import styles from "./Input.module.css";

import { RefObject } from "react";

interface IInputProps {
  id: string;
  className?: string;
  name?: string;
  ref?: RefObject<HTMLInputElement>;
  type?: "text" | "email" | "password" | "checkbox";
  value?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  onClickAction?: () => void;
}

import React, { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
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
    <div className={className}>
      <input
        id={id}
        name={name}
        className={styles.input}
        ref={ref}
        type={type}
        value={value}
        placeholder={type !== "checkbox" ? placeholder : ""}
        readOnly={isReadOnly}
        onClick={onClickAction}
      />
      {type === "checkbox" && <label htmlFor={id}>{placeholder}</label>}
    </div>
  );
});
