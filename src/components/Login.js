import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      window.M.toast({
        html: `Welcome back, ${result.user.email}`,
        classes: "green",
      });
      navigate("/"); 
    } catch (error) {
      window.M.toast({ html: error.message, classes: "red" });
    }
  };

  return (
    <div className="center container" style={{ maxWidth: "500px" }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn blue">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
