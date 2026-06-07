import styles from "./pagination.module.css";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.navBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ‹
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.active : ""}`}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={styles.navBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
