import styles from "./ListModule.module.css";

import Image from "next/image";
import { useState } from "react";

import { sortListElementsByColumn } from "@/utils";
import { DOWNLOADS_REMAINING, EXPIRY, NAME, RECEIVED_FROM, RECEIVED_ON, SIZE } from "@/constants";

import upArrowIcon from "@/assets/up-arrow.svg";
import downArrowIcon from "@/assets/down-arrow.svg";

export interface ListElement {
  name: string;
  size: number;
  receivedFrom: string;
  downloadsRemaining: number;
  receivedOn: string;
  expiry: string;
};

type SortedElementsOrder = {
  [K in keyof ListElement]: boolean;
};

interface IListModuleProps {
  elements: ListElement[];
}

const getArrowDirection = (isAscending?: boolean): any => {
  if (isAscending)
    return upArrowIcon;
  else
    return downArrowIcon;
};

export const ListModule = (props: IListModuleProps): JSX.Element => {
  const [listElements, setListElements] = useState<ListElement[]>(props?.elements || []);
  const [sortedElementsOrder, setSortedElementsOrder] = useState<SortedElementsOrder>({
    name: true,
    size: true,
    receivedFrom: true,
    downloadsRemaining: true,
    receivedOn: false,
    expiry: true,
  });

  const handleSort = (columnKey: keyof ListElement): void => {
    const sortedListElements: ListElement[] = sortListElementsByColumn(listElements, columnKey, !sortedElementsOrder[columnKey]);
    setListElements(sortedListElements);
    setSortedElementsOrder(pSortedElementsOrder => (
      { ...pSortedElementsOrder, [columnKey]: !pSortedElementsOrder[columnKey] }
    ));
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("name")}>
              <div className={styles.headerDiv}>
                {NAME}
                <Image src={getArrowDirection(sortedElementsOrder["name"])} alt="arrow-icon" width={12} height={12} />
              </div>
            </th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("size")}>
              <div className={styles.headerDiv}>
                {SIZE}
                <Image src={getArrowDirection(sortedElementsOrder["size"])} alt="arrow-icon" width={12} height={12} />
              </div>
            </th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("receivedFrom")}>
              {RECEIVED_FROM}
              <Image src={getArrowDirection(sortedElementsOrder["receivedFrom"])} alt="arrow-icon" width={12} height={12} />
            </th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("downloadsRemaining")}>
              {DOWNLOADS_REMAINING}
              <Image src={getArrowDirection(sortedElementsOrder["downloadsRemaining"])} alt="arrow-icon" width={12} height={12} />
            </th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("receivedOn")}>
              {RECEIVED_ON}
              <Image src={getArrowDirection(sortedElementsOrder["receivedOn"])} alt="arrow-icon" width={12} height={12} />
            </th>
            <th className={styles.tableHeaderValue} onClick={() => handleSort("expiry")}>
              {EXPIRY}
              <Image src={getArrowDirection(sortedElementsOrder["expiry"])} alt="arrow-icon" width={12} height={12} />
            </th>
          </tr>
        </thead>
        <tbody>
          {listElements.map((element: ListElement, index: number) => (
            <tr key={index}>
              <td className={styles.tableCell}>{element?.name || ""}</td>
              <td className={styles.tableCell}>{element?.size || 0}</td>
              <td className={styles.tableCell}>{element?.receivedFrom || ""}</td>
              <td className={styles.tableCell}>{element?.downloadsRemaining || 0}</td>
              <td className={styles.tableCell}>{element?.receivedOn}</td>
              <td className={styles.tableCell}>{element?.expiry || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
