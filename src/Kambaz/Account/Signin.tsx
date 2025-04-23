import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const signin = async () => {
    if (!credentials.username || !credentials.password) {
      setError("Username and password are required");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const user = await client.signin(credentials);
      if (!user) {
        setError("Login failed. Please check your credentials.");
        return;
      }
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Signin error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <input 
        defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        className="form-control mb-2" 
        placeholder="username" 
        id="wd-username" 
      />
      <input 
        defaultValue={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="form-control mb-2" 
        placeholder="password" 
        type="password" 
        id="wd-password" 
      />
      <button 
        onClick={signin} 
        id="wd-signin-btn" 
        className="btn btn-primary w-100"
        disabled={loading}
      > 
        {loading ? "Signing in..." : "Sign in"} 
      </button>
      <Link id="wd-signup-link" to="/Kambaz/Account/Signup">Sign up</Link>
    </div>
  );
}
