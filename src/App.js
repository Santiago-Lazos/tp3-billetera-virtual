import "./App.css";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Totp from "./pages/Totp";
import Account from "./pages/Account";
import VerifyAccount from "./pages/verify-account";
import SearchUsers from "./pages/SearchUsers";
import VerifyTotp from "./pages/VerifyTotp";
import Transfer from "./pages/Transfer";
import Transfers from "./pages/Transfers";
import Receipt from "./pages/Receipt";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./pages/Logout"; // 👈 agregado
import TotpSetupForm from "./pages/TotpSetupForm";
import TotpSetupResult from "./pages/TotpSetupResult";
import EditProfile from "./pages/EditProfile"; // Importalo

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#222",
          borderRadius: 5,
        },
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/totp-setup" element={<TotpSetupForm />} />
            <Route path="/totp-result" element={<TotpSetupResult />} />

            {/* Rutas protegidas */}
            <Route
              path="/totp"
              element={
                <PrivateRoute>
                  <Totp />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/search-users"
              element={
                <PrivateRoute>
                  <SearchUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/verify-totp"
              element={
                <PrivateRoute>
                  <VerifyTotp />
                </PrivateRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <PrivateRoute>
                  <Transfer />
                </PrivateRoute>
              }
            />
            <Route
              path="/transfers"
              element={
                <PrivateRoute>
                  <Transfers />
                </PrivateRoute>
              }
            />
            <Route
              path="/comprobante"
              element={
                <PrivateRoute>
                  <Receipt />
                </PrivateRoute>
              }
            />

            <Route
              path="/edit-profile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
