import { createUser, getUserByEmail, getUserById, checkPassword, deleteUser } from "../models/user";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

export async function registerUser(data: { name: string; email: string; password: string; role?: "user" | "admin" }) {
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = await createUser(data);
  return newUser;
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await getUserByEmail(data.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await checkPassword(user, data.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

export async function getUserProfile(id: number) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash: _, ...profile } = user;
  return profile;
}

export async function removeUser(id: number) {
  await deleteUser(id);
  return { message: "User deleted successfully" };
}
