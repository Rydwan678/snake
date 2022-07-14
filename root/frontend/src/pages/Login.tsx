import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({
    name: "",
    password: "",
  });

  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  function updateUserData(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      [e.target.name]: e.target.value,
    }));
  }

  async function loginUser() {
    try {
      console.log("0");
      const test = await fetch("http://127.0.0.1:5500/test", {
        method: "GET",
      });
      console.log("1");
      const response = await fetch("http://127.0.0.1:5500/login", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-type": "application/json",
        },
      });
      console.log("2");

      const data = await response.json();

      setInfo(data.message);

      await localStorage.setItem("token", data.token);
      const sessionToken = await localStorage.getItem("token");
      if (sessionToken !== "null" || sessionToken !== null) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("loginError", error);
      setInfo(JSON.stringify(error));
    }
  }

  return (
    <div className="user-login">
      <div className="login-container">
        <div className="login-inputs">
          <h1>Login</h1>
          <p>Name</p>
          <input name="name" onChange={(e) => updateUserData(e)}></input>

          <p>Password</p>
          <input name="password" onChange={(e) => updateUserData(e)}></input>
        </div>
        <button onClick={loginUser}>
          <p>LOGIN</p>
        </button>
      </div>
      <div className="login-down-text">
        <p>Don't have an account?</p>
        <Link to="/register">
          <p>&nbsp;Register</p>
        </Link>
      </div>
      <div className="login-down-text">
        {info && <p className="info">{info}</p>}
      </div>
    </div>
  );
}
