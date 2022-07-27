import { UserRegister } from "../../types";
import express from "express";

const pool = require("../../database");
const router = express.Router();

router.post("/register", async (req: { body: UserRegister }, res: any) => {
  const user = req.body;

  try {
    await validateIfEmailAlreadyExist(user);
    await validateIfNameAlreadyExist(user);
    await pool.query(
      `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`
    );
    res.status(200).json({ message: "Account created successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error });
  }
});

function validateIfEmailAlreadyExist(user: UserRegister) {
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

function validateIfNameAlreadyExist(user: UserRegister) {
  return new Promise(async (resolve, reject) => {
    const accountsWithSameName = await pool.query(
      `SELECT * FROM users WHERE name = '${user.name}'`
    );
    if (accountsWithSameName.rows.length === 0) {
      resolve("success");
    } else if (accountsWithSameName.rows.length > 0) {
      reject("Account with this name already exist");
    }
  });
}

module.exports = router;
