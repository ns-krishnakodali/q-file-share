import styles from "./NavBar.module.css";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from "@/elements";

import qfsLogo from '@/assets/qfs-logo.svg';
import logoutLogo from '@/assets/logout.svg';

interface INavBarProps {
  pageName?: string;
  pageURL?: string;
  className?: string;
  showLogo?: boolean;
}

export const NavBar = (props: INavBarProps): JSX.Element => {
  const { pageName, pageURL, className, showLogo = true } = props;

  const router = useRouter();

  return (
    <div className={styles.navbar}>
      {showLogo && (
        <div className={styles.navbarLogo} onClick={() => { router.push("/dashboard") }}>
          <Image
            src={qfsLogo}
            alt="QFS Logo"
            width={50}
            height={50}
            priority
          />
        </div>
      )}
      {pageName &&
        <Button
          id="navbar-button"
          className={styles.navbarButton}
          variant="text"
          onClickAction={() => router.push(pageURL || "")}
        >
          {pageName}
        </Button>
      }
      <div className={styles.logout} onClick={() => { }}>
        <Image
          src={logoutLogo}
          alt="QFS Logo"
          width={30}
          height={30}
          priority
        />
      </div>
    </div>
  );
};
