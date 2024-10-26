import styles from "./NavBar.module.css";

export type Page = "dashboard" | "shared_files" | "received_files";

interface INavBar {
  currentPage: Page;
  showLogo: boolean;
}

export const NavBar = ({ currentPage, showLogo }: INavBar) => {
  return (
    <div className={styles.navbar}>
      {showLogo && (
        <a href="/dashboard" className={styles.navbar_logo}>
          Q-File Share
        </a>
      )}
      {currentPage !== "shared_files" && (
        <a href="/shared_files" className={styles.navbar_menu_item}>
          Shared files
        </a>
      )}
      {currentPage !== "received_files" && (
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
