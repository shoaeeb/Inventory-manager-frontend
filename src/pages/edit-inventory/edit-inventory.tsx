import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../create-inventory/create-inventory.module.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const EditInventory = () => {
  const { id } = useParams();
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

  const [generalError, setGeneralError] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch(`${BASE_URL}/api/inventory/item/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { item } = await res.json();

      console.log(item);

      if (item) {
        setName(item.name);
        setPrice(item.price);
        setPreview(item.image_url);
      }
    };
    fetchInventory();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    if (picture) formData.append("picture", picture);
    try {
      await fetch(`${BASE_URL}/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      navigate("/inventory");
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
      <h1 className={styles.title}>Edit Item</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {generalError && <p className={styles.error}>{generalError}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          {serverErrors.name && (
            <p style={{ color: "orangered" }}>{serverErrors.name}</p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Price ($)</label>
          <input
            className={styles.input}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
          />
          {serverErrors.price && (
            <p style={{ color: "orangered" }}>{serverErrors.price[0]}</p>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Picture</label>
          <label className={styles.fileLabel}>
            {preview ? (
              <img src={preview} alt="preview" className={styles.preview} />
            ) : (
              <span>Click to change Image</span>
            )}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
        </div>
        <button className={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditInventory;
