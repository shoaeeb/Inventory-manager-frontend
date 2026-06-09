import { Link } from "react-router-dom";
import styles from "./inventory-card.module.css";

interface Props {
  item: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    category: string;
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
        <div className={styles.meta}>
          <span className={styles.category}>{item.category}</span>
          <span className={item.quantity < 3 ? styles.lowStock : styles.qty}>
            Qty:{item.quantity}
          </span>
        </div>
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
