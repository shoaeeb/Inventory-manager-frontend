import { Link } from "react-router-dom";
import styles from "./inventory-card.module.css";

interface Props {
  item: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
  onDelete: (id: number) => void;
}

const InventoryCard = ({ item, onDelete }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={item.image_url} alt={item.name} className={styles.image} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.price}>${Number(item.price).toFixed(2)}</p>
      </div>
      <div className={styles.actions}>
        <Link to={`/edit-inventory/${item.id}`} className={styles.editBtn}>
          Edit
        </Link>
        <button className={styles.deleteBtn} onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default InventoryCard;
