import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./InventoryPage.module.css";
import InventoryCard from "../../components/inventory-card/inventory-card";
import Pagination from "../../components/pagination/pagination";

const BASE_URL = import.meta.env.VITE_API_URL;
interface InventoryItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        search,
        page: String(page),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      });

      try {
        const res = await fetch(`${BASE_URL}/api/inventory?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [search, minPrice, maxPrice, page, token, refresh]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;

    try {
      await fetch(`${BASE_URL}/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh((prev) => prev + 1); // triggers re-fetch
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setPage(1);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Inventory</h1>
        <Link to="/create-inventory" className={styles.addBtn}>
          {" "}
          + Add Item
        </Link>
      </div>
      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by name...."
          value={search}
          onChange={(e) => handleSearchChange(e)}
        />
        <input
          className={styles.priceInput}
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => handleMinPriceChange(e)}
        />
        <input
          className={styles.priceInput}
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => handleMaxPriceChange(e)}
        />
        <button className={styles.clearBtn} onClick={handleClear}>
          Clear
        </button>
      </div>
      {loading ? (
        <p className={styles.loading}>Loading....</p>
      ) : items.length === 0 ? (
        <p className={styles.empty}>No item Found</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <InventoryCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default InventoryPage;
