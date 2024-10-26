import styles from "./NavBar.module.css";

export type Page = "dashboard" | "shared-files" | "received-files";

interface INavBarProps {
  currentPage: Page;
  showLogo: boolean;
}

export const NavBar = ({ currentPage, showLogo }: INavBarProps) => {
  return (
    <div className={styles.navbar}>
      {showLogo && (
        <a href="/dashboard" className={styles.navbar_logo}>
          Q-File Share
        </a>
      )}
      {currentPage !== "shared-files" && (
        <a href="/shared-files" className={styles.navbar_menu_item}>
          Shared files
        </a>
      )}
      {currentPage !== "received-files" && (
        <a href="/received_files" className={styles.navbar_menu_item}>
          Received files
        </a>
      )}
      <a href="#" className={styles.navbar_menu_item}>
        Log out
      </a>
    </div>
  );
};
