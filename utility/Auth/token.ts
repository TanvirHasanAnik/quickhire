import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

export interface UserPayload {
  id: number;
  email: string;
  role: "user" | "admin";
}

export const verifyToken = (req: Request): UserPayload => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const verifyAdmin = (req: Request): UserPayload => {
  const user = verifyToken(req);
  if (user.role !== "admin") {
    throw new Error("Access denied. Admin role required.");
  }
  return user;
};

export function extractPayload(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    return JSON.parse(atob(base64Payload));
  } catch (e) {
    return null;
  }
}
