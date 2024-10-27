import styles from "./ListModule.module.css";

type ListItem = {
  name: string;
  size: string;
  receivedFrom: string;
  expiry: string;
  downloadsRemaining: number;
};

interface IListModuleProps {
  items: ListItem[];
}

const ListModule = (props: IListModuleProps) => {
  const {items} = props;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Size</th>
            <th className={styles.tableHeader}>Received From</th>
            <th className={styles.tableHeader}>Expiry</th>
            <th className={styles.tableHeader}>Downloads Remaining</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
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

export default ListModule;
