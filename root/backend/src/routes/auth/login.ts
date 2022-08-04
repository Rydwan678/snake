import express from "express";
import { UserLogin, GetUserData } from "../../types";
import jwt from "jsonwebtoken";

const pool = require("../../database");

// kurs gita
// gotowy projekt z ts

const router = express.Router();

const ACCESS_TOKEN = "123456789";

router.post("/login", async (req: { body: UserLogin }, res: any) => {
  const loginData = req.body;

  try {
    const user = await checkForAccount(loginData);
    const token = jwt.sign(user, ACCESS_TOKEN);
    res.status(200).json({ message: "You logged in", token: token });
  } catch (error) {
    res.status(401).json({ message: error });
  }
});

function checkForAccount(user: UserLogin) {
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

module.exports = router;
