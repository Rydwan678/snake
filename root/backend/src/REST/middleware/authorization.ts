import jwt from "jsonwebtoken";
import express, { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN } from "../configs/database";

export default function authorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];
  const body = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.body = { user, ...body };
    console.log("AUTORHIZATION", req.body);
    next();
  });
}
