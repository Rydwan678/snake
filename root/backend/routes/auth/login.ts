import express from "express";
import { Client } from "pg";
import { UserLogin, UserData } from "../../types";
import jwt from "jsonwebtoken";

//kurs gita
// gotowy projekt z ts

const router = express.Router();

const ACCESS_TOKEN = "123456789";

const client = new Client({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "SNAKE",
});

function checkForAccount(user: UserLogin) {
  return new Promise<UserData>(async (resolve, reject) => {
    const response = await client.query(
      `SELECT * FROM users WHERE password = '${user.password}' AND (name = '${user.name}' OR email = '${user.name}')`
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

router.get("/test", async (req: { body: UserLogin }, res: any) => {
  console.log("hello");
  res.status(200).end();
});

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

module.exports = router;
