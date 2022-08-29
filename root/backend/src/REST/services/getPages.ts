import { pool } from "../database/pool";

async function getPages(usersCount: number) {
  try {
    const response = await pool.query("SELECT * FROM users");
    const numberOfUsers = response.rows.length;

    if (Math.round(numberOfUsers / usersCount) < numberOfUsers / usersCount) {
      return Math.round(numberOfUsers / usersCount) + 1;
    } else {
      return Math.round(numberOfUsers / usersCount);
    }
  } catch (error) {
    console.log("getPagesError", error);
  }
}
