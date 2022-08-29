import { pool } from "../database/pool";
import { Login, Register, GetUserData } from "../interfaces";

export function authenticateLogin(user: Login) {
  return new Promise<GetUserData>(async (resolve, reject) => {
    const response = await pool.query(
      `SELECT * FROM users WHERE password = '${user.password}' AND (login = '${user.login}' OR email = '${user.login}')`
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

export async function authenticateRegister(user: Register) {
  try {
    await checkIfNameAlreadyExist(user);
    await checkIfEmailAlreadyExist(user);
  } catch (error) {
    return error;
  }
}

function checkIfNameAlreadyExist(user: Register) {
  return new Promise(async (resolve, reject) => {
    const accountsWithSameName = await pool.query(
      `SELECT * FROM users WHERE login = '${user.login}'`
    );
    if (accountsWithSameName.rows.length === 0) {
      resolve("success");
    } else if (accountsWithSameName.rows.length > 0) {
      reject("Account with this name already exist");
    }
  });
}

function checkIfEmailAlreadyExist(user: Register) {
  return new Promise(async (resolve, reject) => {
    const accountsWithSameEmail = await pool.query(
      `SELECT * FROM users WHERE email = '${user.email}'`
    );
    if (accountsWithSameEmail.rows.length === 0) {
      resolve("success");
    } else if (accountsWithSameEmail.rows.length > 0) {
      reject("Account with this email already exist");
    }
  });
}
