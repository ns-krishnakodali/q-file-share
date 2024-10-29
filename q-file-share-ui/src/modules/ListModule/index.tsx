import styles from "./ListModule.module.css";

import { DOWNLOADS_REMAINING, EXPIRY, NAME, RECEIVED_FROM, SIZE } from "@/constants";

type ListItem = {
  name: string;
  size: number;
  receivedFrom: string;
  expiry: string;
  downloadsRemaining: number;
};

interface IListModuleProps {
  items: ListItem[];
}

export const ListModule = (props: IListModuleProps): JSX.Element => {
  const { items } = props;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderValue}>{NAME}</th>
            <th className={styles.tableHeaderValue}>{SIZE}</th>
            <th className={styles.tableHeaderValue}>{RECEIVED_FROM}</th>
            <th className={styles.tableHeaderValue}>{EXPIRY}</th>
            <th className={styles.tableHeaderValue}>{DOWNLOADS_REMAINING}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: ListItem, index: number) => (
            <tr key={index}>
              <td className={styles.tableCell}>{item?.name || ""}</td>
              <td className={styles.tableCell}>{item?.size || 0}</td>
              <td className={styles.tableCell}>{item?.receivedFrom || ""}</td>
              <td className={styles.tableCell}>{item?.expiry || ""}</td>
              <td className={styles.tableCell}>{item?.downloadsRemaining || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
