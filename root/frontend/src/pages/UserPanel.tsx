/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export default function UserPanel() {
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("token")
  );
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
  });

  const navigate = useNavigate();

  async function logout() {
    try {
      await localStorage.setItem("token", "null");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserData() {
    console.log("tutaj", sessionToken);
    try {
      const response = await fetch("http://127.0.0.1:5500/userPanel", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Beaer ${sessionToken}`,
        },
      });
      const data = await response.json();
      setUserData(data.userData.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="user-login">
      <div className="login-container">
        <div className="login-inputs">
          <h1>Register</h1>
          <p>Name</p>
          <input name="name" defaultValue={userData.name}></input>
          <p>Email</p>
          <input name="email" defaultValue={userData.email}></input>
          <p>Date of birth</p>
          <input name="dateOfBirth" defaultValue={userData.dateOfBirth}></input>
          <p>Password</p>
          <input name="password" defaultValue={userData.password}></input>
        </div>
        <Link to="/">
          <button>
            <p>GO BACK</p>
          </button>
        </Link>

        <button onClick={logout}>
          <p>LOGOUT</p>
        </button>
      </div>
    </div>
  );
}
