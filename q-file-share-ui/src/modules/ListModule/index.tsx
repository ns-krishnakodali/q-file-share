import styles from "./ListModule.module.css";

import Image from "next/image";
import { useState } from "react";

import { sortListElementsByColumn } from "@/utils";
import {
  NAME,
  SIZE,
  SENT_TO,
  RECEIVED_FROM,
  DOWNLOAD_COUNT,
  DOWNLOADS_REMAINING,
  EXPIRY,
  SENT_ON,
  RECEIVED_ON,
} from "@/constants";

import upArrowIcon from "@/assets/up-arrow.svg";
import downArrowIcon from "@/assets/down-arrow.svg";

export interface ListElement {
  name: string;
  size: number;
  transceive: string;
  transactionDate: string;
  expiry: string;
  downloads: number;
}

type SortedElementsOrder = {
  [K in keyof ListElement]: boolean;
};

interface IListModuleProps {
  elements: ListElement[];
  renderSendFilesLayout?: boolean;
}

const getArrowDirection = (isAscending?: boolean): any => {
  if (isAscending) return upArrowIcon;
  else return downArrowIcon;
};

const initialElementsOrder: SortedElementsOrder = {
  name: true,
  size: true,
  transceive: true,
  downloads: true,
  transactionDate: false,
  expiry: true,
};

export const ListModule = (props: IListModuleProps): JSX.Element => {
  const { elements, renderSendFilesLayout = false } = props;

  const [listElements, setListElements] = useState<ListElement[]>(
    elements || [],
  );
  const [sortedElementsOrder, setSortedElementsOrder] =
    useState<SortedElementsOrder>(initialElementsOrder);

  const handleSort = (columnKey: keyof ListElement): void => {
    const sortedListElements: ListElement[] = sortListElementsByColumn(
      listElements,
      columnKey,
      !sortedElementsOrder[columnKey],
    );
    setListElements(sortedListElements);
    setSortedElementsOrder((pSortedElementsOrder) => ({
      ...initialElementsOrder,
      [columnKey]: !pSortedElementsOrder[columnKey],
    }));
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th
              className={styles.tableHeaderValue}
              onClick={() => handleSort("name")}
            >
              <div className={styles.headerDiv}>
                {NAME}
                <Image
                  src={getArrowDirection(sortedElementsOrder["name"])}
                  alt="arrow-icon"
                  width={12}
                  height={12}
                />
              </div>
            </th>
            <th
              className={styles.tableHeaderValue}
              onClick={() => handleSort("size")}
            >
              <div className={styles.headerDiv}>
                {SIZE}
                <Image
                  src={getArrowDirection(sortedElementsOrder["size"])}
                  alt="arrow-icon"
                  width={12}
                  height={12}
                />
              </div>
            </th>
            <th
              className={styles.tableHeaderValue}
              onClick={() => handleSort("transceive")}
            >
              {renderSendFilesLayout ? SENT_TO : RECEIVED_FROM}
              <Image
                src={getArrowDirection(sortedElementsOrder["transceive"])}
                alt="arrow-icon"
                width={12}
                height={12}
              />
            </th>
            <th
              className={styles.tableHeaderValue}
              onClick={() => handleSort("transactionDate")}
            >
              {renderSendFilesLayout ? SENT_ON : RECEIVED_ON}
              <Image
                src={getArrowDirection(sortedElementsOrder["transactionDate"])}
                alt="arrow-icon"
                width={12}
                height={12}
              />
            </th>
            <th
              className={styles.tableHeaderValue}
              onClick={() => handleSort("expiry")}
            >
              {EXPIRY}
              <Image
                src={getArrowDirection(sortedElementsOrder["expiry"])}
                alt="arrow-icon"
                width={12}
                height={12}
              />
            </th>
            <th
              className={styles.tableHeaderValue}
              onClick={() => handleSort("downloads")}
            >
              {renderSendFilesLayout ? DOWNLOAD_COUNT : DOWNLOADS_REMAINING}
              <Image
                src={getArrowDirection(sortedElementsOrder["downloads"])}
                alt="arrow-icon"
                width={12}
                height={12}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {listElements.map((element: ListElement, index: number) => (
            <tr key={index}>
              <td className={styles.tableCell}>{element?.name || ""}</td>
              <td className={styles.tableCell}>{element?.size || 0}</td>
              <td className={styles.tableCell}>{element?.transceive || ""}</td>
              <td className={styles.tableCell}>{element?.transactionDate}</td>
              <td className={styles.tableCell}>{element?.expiry || ""}</td>
              <td className={styles.tableCell}>{element?.downloads || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
