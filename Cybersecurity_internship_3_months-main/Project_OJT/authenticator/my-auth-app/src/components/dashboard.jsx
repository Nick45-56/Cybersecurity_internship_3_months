// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../service/api";

export default function Dashboard() {
  const [service, setService] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await API.get("/accounts");
      setAccounts(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAccounts();
    const t = setInterval(fetchAccounts, 30000);
    return () => clearInterval(t);
  }, []);

  const handleAdd = async () => {
    if (!service.trim()) return;
    try {
      setLoading(true);
      const res = await API.post(
        `/add-account?service=${encodeURIComponent(service)}`,
        {},
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(res.data);
      setQrUrl(url);
      setService("");
      await fetchAccounts();
    } catch (e) {
      console.error(e);
      setQrUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        color: "",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              background: "#2563eb",
              color: "black",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Logout
          </button>
        </div>

        {/* Add Account */}
        <div
          style={{
            marginTop: "20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "16px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
            Add an Authenticator Account
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
<input
  placeholder="Service name (e.g., Google, Microsoft)"
  value={service}
  onChange={(e) => setService(e.target.value)}
  style={{
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#000",   // black background
    color: "#fff",             // white text
    caretColor: "#fff",        // white cursor
  }}
/>

            <button
              onClick={handleAdd}
              disabled={loading}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
          {qrUrl && (
            <div style={{ marginTop: "15px" }}>
              <div style={{ fontSize: "14px", marginBottom: "6px" }}>
                Scan this QR in your Authenticator app:
              </div>
              <img
                src={qrUrl}
                alt="QR Code"
                style={{
                  width: "190px",
                  height: "190px",
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                }}
              />
            </div>
          )}
        </div>

        {/* Accounts List */}
        <div
          style={{
            marginTop: "20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "16px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>
            My Accounts (TOTP codes)
          </h2>
          {accounts.length === 0 ? (
            <div style={{ color: "#bbb" }}>No accounts yet. Add one above.</div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "8px",
              }}
            >
              {accounts.map((a, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                  }}
                >
                  <span>{a.service}</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "18px",
                      color: "white",
                    }}
                  >
                    {a.code}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div style={{ fontSize: "12px", marginTop: "8px", color: "#bbb" }}>
            Codes refresh every ~30 seconds.
          </div>
        </div>
      </div>
    </div>
  );
}
