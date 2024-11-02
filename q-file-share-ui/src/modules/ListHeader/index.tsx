import Image from "/Users/talarirahul/Desktop/CNS/q-file-share/q-file-share-ui/node_modules/next/image";
import styles from "./ListHeader.module.css";
import Filter from "@/assets/filter.svg";
import { Button } from "/Users/talarirahul/Desktop/CNS/q-file-share/q-file-share-ui/src/elements/Button";
import { Text } from "/Users/talarirahul/Desktop/CNS/q-file-share/q-file-share-ui/src/elements/Text";

interface ListHeaderProps {
  title: string;
}
export const ListHeader: React.FC<ListHeaderProps> = ({ title }) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      <Button
        id="button1"
        type="button"
        variant="text"
        className={styles.filter}
      >
        <Image src={Filter} alt="Filter" className={styles.logo} />
        <div className={styles.title}>
          <Text>Filter</Text>
        </div>
      </Button>
    </div>
  );
};
