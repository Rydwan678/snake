import { pool } from "./pool";
import { Change } from "../interfaces/types";
import { getAllUsersParams, User } from "../interfaces";

export async function getUsers(users: number[]) {
  try {
    const response = await pool.query(
      `SELECT * FROM users WHERE id IN (${users.join(",")})`
    );
    const data: User[] = response.rows;
    return data;
  } catch (error) {
    return error;
  }
}

export async function getAllUsers(params: getAllUsersParams) {
  try {
    console.log(params.sorting);
    const responseUsers = await pool.query(
      `SELECT * FROM users WHERE login iLIKE '%${params.searchBar}%'
        OR email iLike '%${params.searchBar}%' ORDER BY ${
        params.sorting.orderBy
      } ${params.sorting.mode} LIMIT ${
        params.table === "pages" ? params.usersCount : "9999999999999"
      } OFFSET ${(params.page - 1) * params.usersCount}`
    );
    const users = responseUsers.rows;
    return users;
  } catch (error) {
    return error;
  }
}

export async function updateUser(
  changeKey: Change,
  changeValue: string,
  userID: number
) {
  try {
    await pool.query(
      `UPDATE users SET ${changeKey} = '${changeValue}' WHERE id = ${userID} `
    );
  } catch (error) {
    return error;
  }
}

export async function deleteUsers(users: number[]) {
  try {
    await pool.query(`DELETE FROM users WHERE id IN (${users.join(",")})`);
  } catch (error) {
    return error;
  }
}
