import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Layout from "./Layout/layout";
import Dashboard from "./pages/dashboard/dashboard";
import { useAuth } from "./context/AuthContext";
import InventoryPage from "./pages/inventory/inventoryPage";
import CreateInventory from "./pages/create-inventory/CreateInventoyPage";
import EditInventory from "./pages/edit-inventory/edit-inventory";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/edit-inventory/:id"
          element={
            isAuthenticated ? (
              <Layout>
                <EditInventory />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/create-inventory"
          element={
            isAuthenticated ? (
              <Layout>
                <CreateInventory />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/inventory"
          element={
            isAuthenticated ? (
              <Layout>
                <InventoryPage />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Layout>
                <UserPage />
              </Layout>
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
