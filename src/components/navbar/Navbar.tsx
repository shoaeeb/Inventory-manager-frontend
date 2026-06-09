import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth.service";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className={styles.navbar}>
      <Link className={styles.link} to="/dashboard">
        Dashboard
      </Link>
      <Link to="/inventory" className={styles.link}>
        Inventory
      </Link>
      <Link className={styles.link} to="/create-inventory">
        Create Inventory
      </Link>
      {isAuthenticated && (
        <button
          onClick={async () => {
            await logoutUser();
            logout();
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
