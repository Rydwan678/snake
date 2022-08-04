import React from "react";

interface User {
  login?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  description?: string;
}

export default function useValidateData() {
  async function validateUserData(user: User) {
    try {
      user.login && (await validateName(user));
      user.email && (await validateEmail(user));
      user.password && (await validatePassword(user));
      user.description && (await validateDescription(user));
    } catch (error) {
      throw error;
    }
  }

  function validateName(user: User) {
    return new Promise((resolve, reject) => {
      if (user.login && user.login.length <= 20) {
        resolve("success");
      } else {
        reject("Username can't be longer than 20 characters");
      }
    });
  }

  function validateEmail(user: User) {
    return new Promise((resolve, reject) => {
      if (
        user.email &&
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
      if (user.password !== user.confirmPassword) {
        reject("Your passwords do not match");
      }
      if (user.password && user.password.length < 5) {
        reject("Your password should have at least 5 characters");
      } else if (user.password && user.password.search(/[A-Z]/) < 0) {
        reject("Your password should have at least one upper case letter");
      } else if (user.password && user.password.search(/[0-9]/) < 0) {
        reject("Your password should have at least one number");
      } else {
        resolve("success");
      }
    });
  }

  function validateDescription(user: User) {
    return new Promise((resolve, reject) => {
      if (user.description && user.description.length < 50) {
        resolve("success");
      } else {
        reject("Description can't be longer than 50 characters");
      }
    });
  }

  return validateUserData;
}
