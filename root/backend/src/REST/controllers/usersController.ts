import express from "express";
import {
  getUsers,
  getAllUsers,
  updateUser,
  deleteUsers,
} from "../database/users";
import { UpdateUserData, getAllUsersParams } from "../interfaces";
import { Change } from "../interfaces/types";

export async function get(req: { params: { id: string } }, res: any) {
  try {
    const users = await getUsers(
      req.params.id.split(",").map((user) => parseInt(user))
    );
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(502).json({ message: error });
    return error;
  }
}

export async function getAll(req: any, res: any) {
  try {
    let users = await getAllUsers(JSON.parse(req.headers.params));
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(502).json({ message: error });
    return error;
  }
}

export async function getMe(req: { body: { id: number } }, res: any) {
  try {
    const user = await getUsers([req.body.id]);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(502).json({ message: error });
    return error;
  }
}

export async function update(
  req: { body: { changes: UpdateUserData; userID: number } },
  res: any
) {
  try {
    for (const [key, value] of Object.entries(req.body.changes)) {
      await updateUser(key as Change, value, req.body.userID);
    }
    res.status(200).json({ message: "Changes have been saved" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

export async function remove(req: { params: { id: string } }, res: any) {
  try {
    const users = req.params.id.split(",").map((user) => parseInt(user));
    await deleteUsers(users);
    res.status(200).json({
      message: `You successfully deleted ${users.length} ${
        users.length === 1 ? "user" : "users"
      }`,
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
