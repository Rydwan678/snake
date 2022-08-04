import { UserRegister, Change, UpdateUserData, GetUserData } from "../types";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const pool = require("../database");
const router = express.Router();

const ACCESS_TOKEN = "123456789";

router.post(
  "/userPanel",
  authorization,
  async (req: { body: GetUserData }, res: any) => {
    try {
      const userData = await getUserData(req.body.id);
      res.status(200).json({ userData: userData });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
);

router.post(
  "/updateUser",
  async (
    req: { body: { changes: UpdateUserData; userID: number } },
    res: any
  ) => {
    try {
      console.log("test");
      for (const [key, value] of Object.entries(req.body.changes)) {
        await updateUser(key as Change, value, req.body.userID);
      }
      res.status(200).json({ message: "Changes have been saved" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
);

function authorization(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.body = user;
    next();
  });
}

async function getUserData(userToken: number) {
  try {
    const userData = await pool.query(
      `SELECT * FROM users WHERE id = '${userToken}'`
    );
    return userData;
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(
  changeKey: Change,
  changeValue: string,
  userID: number
) {
  try {
    await pool.query(
      `UPDATE users SET ${changeKey} = '${changeValue}' WHERE id = ${userID} `
    );
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = router;
