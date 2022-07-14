/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
  });

  const [info, setInfo] = useState("");

  async function validateUserData() {
    try {
      await validateName();
      await validateEmail();
      await validatePassword();
      registerUser();
    } catch (error) {
      setInfo(`${error}`);
    }
  }

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

  function validateName() {
    return new Promise((resolve, reject) => {
      if (userData.name.length <= 20) {
        resolve("success");
      } else {
        reject("Username can't be longer than 20 characters");
      }
    });
  }

  function validateEmail() {
    return new Promise((resolve, reject) => {
      if (
        userData.email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        resolve("success");
      } else {
        reject("Your email should look like this: example@domain.com");
      }
    });
  }

  function validatePassword() {
    return new Promise((resolve, reject) => {
      if (userData.password.length < 5) {
        reject("Your password should have at least 5 characters");
      } else if (userData.password.search(/[A-Z]/) < 0) {
        reject("Your password should have at least one upper case letter");
      } else if (userData.password.search(/[0-9]/) < 0) {
        reject("Your password should have at least one number");
      } else {
        resolve("success");
      }
    });
  }

  return (
    <div className="user-login">
      <div className="login-container">
        <div className="login-inputs">
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
        </div>
        <button onClick={validateUserData}>
          <p>REGISTER</p>
        </button>
      </div>
      <div className="login-down-text">
        <p>Already have an account?</p>
        <Link to="/">
          <p>&nbsp;Sign In</p>
        </Link>
      </div>
      <div className="login-down-text">
        {info && <p className="info">{info}</p>}
      </div>
    </div>
  );
}
