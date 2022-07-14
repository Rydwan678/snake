import { Client } from "pg";
import jwt from "jsonwebtoken";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { UserRegister, UserLogin, UserData } from "./types";

const client = new Client({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "SNAKE",
});

const ACCESS_TOKEN = "123456789";

async function main() {
  await client.connect();

  const app = express();

  const routes = require("./routes");

  console.log("1", routes);

  app.use(cors());
  app.use(express.json());

  app.use("/", routes);

  app.get("/*", (req: any, res: any) => {
    res.end();
  });

  // app.post("/register", async (req: { body: UserRegister }, res: any) => {
  //   const user = req.body;

  //   try {
  //     await validateIfEmailAlreadyExist(user);
  //     await validateIfNameAlreadyExist(user);
  //     await client.query(
  //       `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`
  //     );
  //     res.status(200).json({ message: "Account created successfully" });
  //   } catch (error: any) {
  //     res.status(400).json({ message: error });
  //   }
  // });

  // app.post(
  //   "/userPanel",
  //   authorization,
  //   async (req: { body: UserData }, res: any) => {
  //     try {
  //       const userData = await getUserData(req.body.id);
  //       res.status(200).json({ userData: userData });
  //     } catch (error) {
  //       res.status(400).json({ message: error });
  //     }
  //   }
  // );

  app.use((req: any, res: any, next: any) =>
    res.status(404).send("API not found")
  );
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message);
  });

  app.listen(5500, () => {
    console.log("server started");
  });
}

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
    console.log("user", user);
    req.body = user;
    next();
  });
}

function validateIfEmailAlreadyExist(user: UserRegister) {
  return new Promise(async (resolve, reject) => {
    const accountsWithSameEmail = await client.query(
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
    const accountsWithSameName = await client.query(
      `SELECT * FROM users WHERE name = '${user.name}'`
    );
    if (accountsWithSameName.rows.length === 0) {
      resolve("success");
    } else if (accountsWithSameName.rows.length > 0) {
      reject("Account with this name already exist");
    }
  });
}

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

async function getUserData(userToken: number) {
  try {
    const userData = await client.query(
      `SELECT * FROM users WHERE id = '${userToken}'`
    );
    return userData;
  } catch (error) {
    console.log(error);
  }
}

main();
