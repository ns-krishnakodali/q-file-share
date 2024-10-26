import styles from "./NavBar.module.css";

interface INavBarProps {
  pages: { name: string; path: string }[];
  showLogo: boolean;
}

export const NavBar = ({ pages, showLogo }: INavBarProps) => {
  return (
    <div className={styles.navbar}>
      {showLogo && (
        <a href="/dashboard" className={styles.navbar_logo}>
          Q-File Share
        </a>
      )}

      {pages.map((page) => (
        <a key={page.path} href={page.path} className={styles.navbar_menu_item}>
          {page.name}
        </a>
      ))}

      <a href="#" className={styles.navbar_menu_item}>
        Log out
      </a>
    </div>
  );
};
