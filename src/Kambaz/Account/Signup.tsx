import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Signup() {
  const [user, setUser] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
    section: "S101",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const signup = async () => {
    // Validate required fields
    if (!user.username || !user.password) {
      setError("Username and password are required");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      console.log("Attempting to sign up with:", user);
      const currentUser = await client.signup(user);
      if (!currentUser) {
        setError("Sign up failed. Please try again.");
        return;
      }
      console.log("User created successfully");
      dispatch(setCurrentUser(currentUser));
      navigate("/Kambaz/Account/Profile");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wd-signup-screen">
      <h3>Sign up</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <input 
        value={user.username} 
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username form-control mb-2" 
        placeholder="Username (required)" 
      />
      
      <input 
        value={user.password} 
        onChange={(e) => setUser({ ...user, password: e.target.value })} 
        type="password"
        className="wd-password form-control mb-2" 
        placeholder="Password (required)" 
      />
      
      <input 
        value={user.firstName || ""} 
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        className="form-control mb-2" 
        placeholder="First Name" 
      />
      
      <input 
        value={user.lastName || ""} 
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        className="form-control mb-2" 
        placeholder="Last Name" 
      />
      
      <input 
        value={user.email || ""} 
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="form-control mb-2" 
        placeholder="Email" 
        type="email"
      />
      
      <button 
        onClick={signup} 
        disabled={loading}
        className="wd-signup-btn btn btn-primary mb-2 w-100"
      > 
        {loading ? "Creating Account..." : "Sign up"} 
      </button>
      <br />
      <Link to="/Kambaz/Account/Signin" className="wd-signin-link">Sign in</Link>
    </div>
  );
}