import { Handler, withIronSession } from "next-iron-session";
import { SessionHandler } from "../types";

export default function withSession(handler: SessionHandler) {
  return withIronSession(handler, {
    password: process.env.AUTH_SECRET,
    cookieName: "session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
