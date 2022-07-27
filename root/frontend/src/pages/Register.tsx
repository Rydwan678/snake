/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useValidateData from "../hooks/useValidateData";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
  });

  const [info, setInfo] = useState("");

  const validateUserData = useValidateData();

  React.useEffect(() => {
    console.log(userData);
  }, [userData]);

  function updateUserData(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData((previousUserData) => ({
      ...previousUserData,
      [e.target.name]: e.target.value,
    }));
  }

  async function registerUser() {
    try {
      await validateUserData(userData, "register");
      const response = await fetch("http://127.0.0.1:5500/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();
      setInfo(data.message);
    } catch (error) {
      setInfo(JSON.stringify(error));
    }
  }

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-inputs">
          <h1>Register</h1>
          <p>Name</p>
          <input name="name" onChange={(e) => updateUserData(e)}></input>
          <p>Email</p>
          <input
            placeholder="email@domain.org"
            name="email"
            onChange={(e) => updateUserData(e)}
          ></input>
          <p>Date of birth</p>
          <input
            type="date"
            name="dateOfBirth"
            onChange={(e) => updateUserData(e)}
          ></input>
          <p>Password</p>
          <input name="password" onChange={(e) => updateUserData(e)}></input>

          <button onClick={registerUser}>
            <p>REGISTER</p>
          </button>
        </div>
      </div>
      <div className="auth-down-text">
        <p>Already have an account?</p>
        <Link to="/">
          <p>&nbsp;Sign In</p>
        </Link>
      </div>
      <div className="auth-down-text">
        {info && <p className="info">{info}</p>}
      </div>
    </div>
  );
}

// async function registerUser(user: any) {
//   try {
//     const response = await fetch("http://127.0.0.1:5500/register", {
//       method: "POST",
//       body: JSON.stringify({
//         name: user.login.username,
//         email: user.email,
//         dateOfBirth: "18-07-2022",
//         password: user.login.password,
//       }),
//       headers: {
//         "Content-type": "application/json",
//       },
//     });
//     const data = await response.json();
//     setInfo(data.message);
//   } catch (error) {
//     setInfo(JSON.stringify(error));
//   }
// }

// async function getApi() {
//   try {
//     const response = await fetch("https://randomuser.me/api/?results=2000");
//     const data = await response.json();
//     data.results.map(async (user: any) => await registerUser(user));
//   } catch (error) {
//     console.log("error");
//   }
// }
