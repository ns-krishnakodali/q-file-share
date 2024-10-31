import { ListElement } from "@/modules/ListModule";

const sortListByNumbers = (list: any[], key: any, sortAscending: boolean): any[] => {
  return [...list].sort((element1: any, element2: any): number => {
    const comparison: number = element1[key] - element2[key];
    return (sortAscending) ? comparison : -comparison;
  });
};

const sortListByDate = (list: any[], key: any, sortAscending: boolean): any[] => {
  return [...list].sort((element1: any, element2: any): number => {
    const date1: Date = new Date(element1[key]);
    const date2: Date = new Date(element2[key]);
    const comparison: number = date1.getTime() - date2.getTime()
    return (sortAscending) ? comparison : -comparison;
  });
};

const sortListByString = (list: any[], key: any, sortAscending: boolean): any[] => {
  return [...list].sort((element1: any, element2: any): number => {
    const comparison: number = element1[key].localeCompare(element2[key])
    return (sortAscending) ? comparison : -comparison;
  });
};


export const sortListElementsByColumn = (
  listElements: ListElement[],
  columnKey: keyof ListElement,
  sortAscending: boolean
): ListElement[] => {

  if (typeof listElements === "undefined")
    return [];

  if (columnKey === "size" || columnKey == "downloadsRemaining")
    return sortListByNumbers(listElements, columnKey, sortAscending);
  else if (columnKey === "receivedOn" || columnKey === "expiry")
    return sortListByDate(listElements, columnKey, sortAscending);

  return sortListByString(listElements, columnKey, sortAscending);;
};
