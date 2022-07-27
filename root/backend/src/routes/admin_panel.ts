import express from "express";
const pool = require("../database");

const router = express.Router();

const ACCESS_TOKEN = "123456789";

router.post("/getNumberOfPages", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users");
    const numberOfUsers = response.rows.length;

    if (Math.round(numberOfUsers / 7) < numberOfUsers / 7) {
      res
        .status(200)
        .json({ numberOfPages: Math.round(numberOfUsers / 7) + 1 });
    } else {
      res.status(200).json({ numberOfPages: Math.round(numberOfUsers / 7) });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
});

router.post("/getUsers", async (req, res) => {
  try {
    const pages = await getNumberOfPages(req.body.usersCount);
    const users = await getUsers(
      req.body.page,
      req.body.sorting,
      req.body.searchBar,
      req.body.usersCount,
      req.body.table
    );
    res.status(200).json({ users: users, pages: pages });
  } catch (error) {
    console.log("error", error);
    res.status(401);
  }
});

router.post("/getUser", async (req, res) => {
  try {
    const userID = req.body.userID;
    const response = await pool.query(
      `SELECT * FROM users WHERE id = '${userID}'`
    );
    const user = response.rows[0];
    res.status(200).json({ user: user });
  } catch (error) {
    console.log("error");
    res.status(400);
  }
});

router.post("/deleteUsers", async (req, res) => {
  try {
    const users = req.body.selectedUsers;
    await deleteUsers(users);
    res.status(200).json({
      message: `You successfully deleted ${users.length} ${
        users.length === 1 ? "user" : "users"
      }`,
    });
  } catch (error) {
    console.log("error", error);
    res.status(401);
  }
});

async function getUsers(
  page: number,
  sorting: { orderBy: string; mode: string },
  search: string,
  usersCount: number,
  table: string
) {
  try {
    const responseUsers = await pool.query(
      `SELECT * FROM users WHERE name iLIKE '%${search}%'
      OR email iLike '%${search}%' ORDER BY ${sorting.orderBy} ${
        sorting.mode
      } LIMIT ${table === "pages" ? usersCount : "9999999999999"} OFFSET ${
        (page - 1) * usersCount
      }`
    );
    const users = responseUsers.rows;
    return users;
  } catch (error) {
    console.log("getUsersError", error);
  }
}

async function deleteUsers(users: number[]) {
  try {
    console.log(users.join(","));
    await pool.query(`DELETE FROM users WHERE id IN (${users.join(",")})`);
  } catch (error) {
    console.log("deleteusers", error);
  }
}

async function getNumberOfPages(usersCount: number) {
  try {
    const response = await pool.query("SELECT * FROM users");
    const numberOfUsers = response.rows.length;

    if (Math.round(numberOfUsers / usersCount) < numberOfUsers / usersCount) {
      return Math.round(numberOfUsers / usersCount) + 1;
    } else {
      return Math.round(numberOfUsers / usersCount);
    }
  } catch (error) {
    console.log("getPagesError", error);
  }
}

module.exports = router;
