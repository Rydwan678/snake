import jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../REST/configs/database";

export default function authorization(token: string) {
  let userID: number | undefined;

  jwt.verify(token, ACCESS_TOKEN, (err: any, user: any) => {
    if (err) {
      throw "Token is not valid";
    }
    userID = user.id;
  });

  return userID;
}
