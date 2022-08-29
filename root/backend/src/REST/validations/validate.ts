import { pool } from "../database/pool";
import { Register, GetUserData } from "../interfaces";

export async function validateRegister(user: Register) {
  try {
    await validateName;
    await validateEmail;
    await validatePassword;
    await validateEmail;
  } catch (error) {
    throw error;
  }
}

function validateName(login: string) {
  return new Promise(async (resolve, reject) => {
    if (login && login.length <= 20) {
      const accountsWithSameName = await pool.query(
        `SELECT * FROM users WHERE login = '${login}'`
      );
      if (accountsWithSameName.rows.length === 0) {
        resolve("success");
      } else {
        resolve("Account with this name already exist");
      }
    } else {
      reject("Username can't be longer than 20 characters");
    }
  });
}

function validateEmail(email: string) {
  return new Promise(async (resolve, reject) => {
    if (
      email &&
      email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      const accountsWithSameEmail = await pool.query(
        `SELECT * FROM users WHERE email = '${email}'`
      );
      if (accountsWithSameEmail.rows.length === 0) {
        resolve("success");
      } else {
        reject("Account with this email already exist");
      }
    } else {
      reject("Your email should look like this: example@domain.com");
    }
  });
}

function validatePassword(password: string, confirmPassword: string) {
  return new Promise((resolve, reject) => {
    if (password !== confirmPassword) {
      reject("Your passwords do not match");
    }
    if (password && password.length < 5) {
      reject("Your password should have at least 5 characters");
    } else if (password && password.search(/[A-Z]/) < 0) {
      reject("Your password should have at least one upper case letter");
    } else if (password && password.search(/[0-9]/) < 0) {
      reject("Your password should have at least one number");
    } else {
      resolve("success");
    }
  });
}

function checkForAccount(login: string, password: string) {
  return new Promise<GetUserData>(async (resolve, reject) => {
    const response = await pool.query(
      `SELECT * FROM users WHERE password = '${password}' AND (login = '${login}' OR email = '${login}')`
    );

    const userData = response.rows[0];
    if (userData) {
      resolve(userData);
    } else {
      reject(
        "The account name or password that you have entered is incorrect."
      );
    }
  });
}
