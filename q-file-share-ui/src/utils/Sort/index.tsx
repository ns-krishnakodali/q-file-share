import { ListItem } from "@/modules/ListModule";

export const sortItemsByColumn = (items: ListItem[], columnKey: keyof ListItem): ListItem[] => {
  return [...items].sort((a, b) => {
    if (a[columnKey] < b[columnKey]) return -1;
    if (a[columnKey] > b[columnKey]) return 1;
    return 0;
  });
};
