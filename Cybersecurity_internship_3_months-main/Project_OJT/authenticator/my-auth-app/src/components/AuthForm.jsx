import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../service/api";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // step 1 = login/signup, step 2 = OTP
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);

        const res = await API.post("/login", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (res.data.require_2fa) {
          setStep(2);
        } else {
          localStorage.setItem("token", res.data.access_token);
          navigate("/dashboard");
        }
      } else {
        const form = new FormData();
        form.append("email", email);
        form.append("password", password);
        await API.post("/signup", form);
        alert("User created. Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Something went wrong.");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        padding: "20px",
        maxWidth: "400px",
        margin: "50px auto",
        color: "white",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ padding: "10px" }}>
        {step === 1 ? (
          <>
            <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#ccc",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Enter OTP</h2>
            <form onSubmit={handleOtpVerify} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "green",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
