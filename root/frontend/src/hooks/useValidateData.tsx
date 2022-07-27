import React from "react";

type Action = "register" | "panel";

interface User {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export default function useValidateData() {
  async function validateUserData(user: User, action: Action) {
    try {
      await validateName(user);
      await validateEmail(user);
      if (action === "register") {
        await validatePassword(user);
      }
    } catch (error) {
      throw error;
    }
  }

  function validateName(user: User) {
    return new Promise((resolve, reject) => {
      if (user.name.length <= 20) {
        resolve("success");
      } else {
        reject("Username can't be longer than 20 characters");
      }
    });
  }

  function validateEmail(user: User) {
    return new Promise((resolve, reject) => {
      if (
        user.email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        resolve("success");
      } else {
        reject("Your email should look like this: example@domain.com");
      }
    });
  }

  function validatePassword(user: User) {
    return new Promise((resolve, reject) => {
      if (user.password.length < 5) {
        reject("Your password should have at least 5 characters");
      } else if (user.password.search(/[A-Z]/) < 0) {
        reject("Your password should have at least one upper case letter");
      } else if (user.password.search(/[0-9]/) < 0) {
        reject("Your password should have at least one number");
      } else {
        resolve("success");
      }
    });
  }

  return validateUserData;
}
