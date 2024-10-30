import Image from "/Users/talarirahul/Desktop/CNS/q-file-share/q-file-share-ui/node_modules/next/image";
import styles from './ListHeader.module.css';
import Filter from '@/assets/filter.svg';



interface ListHeaderProps {
    title: string; 
    
}

const ListHeader: React.FC<ListHeaderProps> = ({ title }) => {
    return (
        <header className={styles.header}>
            <div className={styles.title}>
                {title}
            </div>
            <button className={styles.filter}>
                <Image src={Filter} alt="Filter" className={styles.logo} />
                
                <div className={styles.title}>
                     Filter
                </div>
                
                
            </button>
        </header>
    );
};

export default ListHeader;
