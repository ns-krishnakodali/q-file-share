import styles from "./NavBar.module.css";

import { redirect } from "next/navigation";

import { Button } from "@/elements";
import { LOG_OUT } from "@/constants";

interface INavBarProps {
  pageName: string;
  pageURL: string;
  showLogo?: boolean;
}

export const NavBar = (props: INavBarProps): JSX.Element => {
  const {pageName, pageURL, showLogo = true} = props;

  return (
    <div className={styles.navbar}>
      {showLogo && (
        <a href="/dashboard" className={styles.navbarLogo}>
          Q-File Share
        </a>
      )}
      <Button
        id="page-name"
        className={styles.navbarMenuItem}
        text={pageName}
        variant="text"
        onClickAction={() => redirect(pageURL)}
      />
      <Button
        id="page-name"
        className={styles.navbarMenuItem}
        text={LOG_OUT}
        variant="text"
        onClickAction={() => redirect("#")}
      />
    </div>
  );
};
