import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./create-inventory.module.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const CreateInventory = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {}
  );
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("Uncategorized");

  const [generalError, setGeneralError] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !picture)
      return setGeneralError("All Fields are required");

    setLoading(true);
    setServerErrors({});
    setGeneralError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("picture", picture);
    formData.append("quantity", quantity);
    formData.append("category", category);

    try {
      const res = await fetch(`${BASE_URL}/api/inventory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) navigate("/inventory");
      else {
        const json = await res.json();
        throw json;
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        setServerErrors(error.errors as Record<string, string[]>);
      } else if (error && typeof error === "object" && "error" in error) {
        setGeneralError(error.error as string);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Add Inventory Item</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {generalError && <p className={styles.error}>{generalError}</p>}
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            placeholder="Item Name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {serverErrors.name && (
            <p style={{ color: "orangered" }}>{serverErrors.name[0]}</p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Price ($)</label>
          <input
            className={styles.input}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
          {serverErrors.price && (
            <p style={{ color: "orangered" }}>{serverErrors.price[0]}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Quantity</label>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
          />
          {serverErrors.quantity && (
            <p style={{ color: "orangered" }}>{serverErrors.quantity[0]}</p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>
          {serverErrors.category && (
            <p style={{ color: "orangered" }}>{serverErrors.category[0]}</p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Picture</label>
          <label className={styles.fileLabel}>
            {preview ? (
              <img src={preview} alt="preview" className={styles.preview} />
            ) : (
              <span>Click to upload image</span>
            )}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
        </div>
        <button className={styles.submitBtn} disabled={loading}>
          {loading ? "Uploading..." : "Create Item"}{" "}
        </button>
      </form>
    </div>
  );
};

export default CreateInventory;
