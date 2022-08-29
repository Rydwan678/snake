import express from "express";
import jwt from "jsonwebtoken";
import { Login, Register } from "../interfaces";
import { ACCESS_TOKEN } from "../configs/database";
import {
  authenticateLogin,
  authenticateRegister,
} from "../middleware/authentication";
import { pool } from "../database/pool";

export async function loginController(req: { body: Login }, res: any) {
  try {
    const user = await authenticateLogin(req.body);
    const token = jwt.sign(user, ACCESS_TOKEN);
    res.status(200).json({ message: "You logged in", token: token });
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

export async function registerController(req: { body: Register }, res: any) {
  const user = req.body;

  try {
    await authenticateRegister(user);
    await pool.query(
      `INSERT INTO users (login, email, password) VALUES ('${user.login}', '${user.email}', '${user.password}')`
    );
    res.status(200).json({ message: "Account created successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error });
  }
}
