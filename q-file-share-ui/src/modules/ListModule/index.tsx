// modules/ListModule/index.tsx
import { useState } from "react";
import styles from "./ListModule.module.css";
import { DOWNLOADS_REMAINING, EXPIRY, NAME, RECEIVED_FROM, SIZE } from "@/constants";
import { sortItemsByColumn } from "@/utils/Sort/index";

export type ListItem = {
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
  const [sortedItems, setSortedItems] = useState(props.items);

  const handleSort = (columnKey: keyof ListItem) => {
    const sorted = sortItemsByColumn(sortedItems, columnKey);
    setSortedItems(sorted);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("name")}>{NAME}</th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("size")}>{SIZE}</th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("receivedFrom")}>{RECEIVED_FROM}</th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("expiry")}>{EXPIRY}</th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("downloadsRemaining")}>{DOWNLOADS_REMAINING}</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr key={index}>
              <td className={styles.tableCell}>{item.name}</td>
              <td className={styles.tableCell}>{item.size}</td>
              <td className={styles.tableCell}>{item.receivedFrom}</td>
              <td className={styles.tableCell}>{item.expiry}</td>
              <td className={styles.tableCell}>{item.downloadsRemaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
