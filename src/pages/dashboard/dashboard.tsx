import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./dashboard.module.css";

const BASE_URL = import.meta.env.VITE_API_URL;

interface DashboardData {
  totalItems: number;
  totalValue: string;
  highestPrice: string;
  mostExpensive: {
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    category: string;
  } | null;
  recentItems: {
    name: string;
    price: number;
    image_url: string;
    quantity: string;
    category: string;
  }[];
}
export default function Dashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        console.log(json);
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.statsGrid}>
          <div className={styles.skeletonStatCard} />
          <div className={styles.skeletonStatCard} />
          <div className={styles.skeletonStatCard} />
        </div>
        <div className={styles.skeletonBlock} />
        <div className={styles.skeletonList}>
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
        </div>
      </div>
    );
  }
  if (!data) return <p>Failed to load dashboard</p>;
  return (
    <div className={styles.page}>
      <h1 className={styles.welcome}>Welcome Back, {user?.username}</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Items:</p>
          <p className={styles.statValue}>{data.totalItems}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Value</p>
          <p className={styles.statValue}>${data.totalValue}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Highest Price</p>
          <p className={styles.statValue}>${data.highestPrice}</p>
        </div>
      </div>
      {data.mostExpensive && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Most Expensive Item</h2>
          <div className={styles.featuredCard}>
            <img
              src={data.mostExpensive.image_url}
              alt={data.mostExpensive.name}
            />

            <div>
              <p className={styles.itemName}>{data.mostExpensive.name}</p>
              <p className={styles.itemPrice}>
                ${Number(data.mostExpensive.price).toFixed(2)}
              </p>
              <p className={styles.itemMeta}>
                {data.mostExpensive.category} . Qty:{" "}
                {data.mostExpensive.quantity}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recently Added</h2>
        <div className={styles.recentList}>
          {data.recentItems.map((item, i) => (
            <div key={i} className={styles.recentItem}>
              <img src={item.image_url} alt={item.name} />
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemMeta}>{item.category}</span>
              <span className={styles.itemPrice}>
                ${Number(item.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Link to="/inventory" className={styles.viewAll}>
        View All Inventory
      </Link>
    </div>
  );
}
