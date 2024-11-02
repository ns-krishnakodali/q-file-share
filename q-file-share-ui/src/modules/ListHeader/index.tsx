import styles from "./ListHeader.module.css";

import Image from "next/image";

import { FILTER } from "@/constants";
import { Text } from "@/elements/Text";
import { Button } from "@/elements/Button";

import filterIcon from "@/assets/filter.svg";
import { Heading } from "@/elements";

interface ListHeaderProps {
  title: string;
}

export const ListHeader: React.FC<ListHeaderProps> = ({ title }) => {
  return (
    <div className={styles.listHeader}>
      <Heading size={3}>{title}</Heading>
      <Button
        id="button1"
        className={styles.filter}
        type="button"
        variant="text"
      >
        <Image
          src={filterIcon}
          alt="Filter"
          width={27}
          height={27}
          className={styles.logo}
        />
        <div className={styles.title}>
          <Text>{FILTER}</Text>
        </div>
      </Button>
    </div>
  );
};
