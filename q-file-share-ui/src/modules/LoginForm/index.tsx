import styles from "./LoginForm.module.css";
import cx from "classnames";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button, Input, Text } from "@/elements";
import { EMAIL, LOGIN, NEW_USER, PASSWORD, SIGN_UP } from "@/constants";

import eyeShow from "@/assets/eye-show.svg";
import eyeHide from "@/assets/eye-hide.svg";

export const LoginForm = (): JSX.Element => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLoginSubmission = (event: FormEvent): void => {
    event.preventDefault();
  };

  return (
    <form className={styles.loginForm} onSubmit={handleLoginSubmission}>
      <div className={styles.loginFormElement}>
        <Input id="email" type="email" placeholder={EMAIL} />
      </div>
      <div className={cx(styles.loginFormElement, styles.passwordContainer)}>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
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
      <Button
        className={styles.loginButton}
        id="login-button"
        type="submit"
        variant="primary"
      >
        {LOGIN}
      </Button>
      <div className={styles.signUpActions}>
        <Text size="small">{NEW_USER}</Text>
        <Button
          id="signup-text"
          className={styles.signUpButton}
          type="button"
          variant="text"
          onClickAction={() => {
            router.push("/sign-up");
          }}
        >
          {SIGN_UP}
        </Button>
      </div>
    </form>
  );
};
