import styles from "./NavBar.module.css";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/elements";

import qfsLogo from "@/assets/qfs-logo.svg";
import logoutLogo from "@/assets/logout.svg";

interface INavBarProps {
  pageName?: string;
  pageURL?: string;
  showLogo?: boolean;
}

export const NavBar = (props: INavBarProps): JSX.Element => {
  const { pageName, pageURL, showLogo = true } = props;

  const router = useRouter();

  return (
    <div className={styles.container}>
      {showLogo && (
        <div
          className={styles.navbarLogo}
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <Image src={qfsLogo} alt="qfs-logo" width={55} height={55} priority />
        </div>
      )}
      <div className={styles.navbarText}>
        {pageName && (
          <Button
            id="navbar-button"
            className={styles.navbarButton}
            variant="text"
            onClickAction={() => router.push(pageURL || "")}
          >
            {pageName}
          </Button>
        )}
        <div className={styles.logout} onClick={() => {}}>
          <Image
            src={logoutLogo}
            alt="QFS Logo"
            width={30}
            height={30}
            priority
          />
        </div>
      </div>
    </div>
  );
};
