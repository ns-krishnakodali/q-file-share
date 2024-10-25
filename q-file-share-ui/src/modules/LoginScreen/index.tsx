import styles from "./LoginScreen.module.css";

import { Button } from "@/elements";

export const LoginScreen = () => {
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

