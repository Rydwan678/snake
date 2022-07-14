import { Client } from "pg";
import jwt from "jsonwebtoken";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

interface UserRegister {
  name: string;
  email: string;
  password: string;
}

interface UserLogin {
  id: number;
  name: string;
  password: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

const client = new Client({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "SNAKE",
});

async function main() {
  await client.connect();

  const app = express();

  const ACCESS_TOKEN = "123456789";

  app.use(cors());
  app.use(express.json());

  app.listen(5500, () => {
    console.log("server started");
  });

  app.get("/", (req: any, res: any) => {
    res.send("hello");
    res.end();
  });

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

  app.post("/register", async (req: { body: UserRegister }, res: any) => {
    const user = req.body;

    try {
      await validateIfEmailAlreadyExist(user);
      await validateIfNameAlreadyExist(user);
      await client.query(
        `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`
      );
      res.status(200).json({ message: "Account created successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error });
    }
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

  app.post("/login", async (req: { body: UserLogin }, res: any) => {
    const loginData = req.body;

    try {
      const user = await checkForAccount(loginData);
      const token = jwt.sign(user, ACCESS_TOKEN);
      res.status(200).json({ message: "You logged in", token: token });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  });

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

  app.post(
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
}

main();
