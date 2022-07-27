import { UserRegister } from "../../types";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserData } from "../../types";

const pool = require("../../database");
const router = express.Router();

const ACCESS_TOKEN = "123456789";

router.post(
  "/userPanel",
  authorization,
  async (req: { body: UserData }, res: any) => {
    try {
      const userData = await getUserData(req.body.id);
      res.status(200).json({ userData: userData });
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

module.exports = router;
