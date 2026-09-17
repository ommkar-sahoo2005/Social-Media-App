import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);

  // Clear fields on mount (optional, safe)
  useEffect(() => {
    setInputs({
      username: "",
      email: "",
      password: "",
      name: "",
    });
  }, []);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      await axios.post("http://localhost:1010/api/auth/register", inputs, {
        withCredentials: true,
      });
      alert("User registered successfully!");
    } catch (error) {
      setErr(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>

        <div className="right">
          <h1>Register</h1>

          <form onSubmit={handleClick}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              autoComplete="off"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              autoComplete="off"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <input
              type="text"
              placeholder="Name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              autoComplete="off"
            />

            {err && <span className="error">{err}</span>}

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
