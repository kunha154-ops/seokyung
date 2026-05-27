import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      status?: string;
      church?: string | null;
      position?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    status?: string;
    church?: string | null;
    position?: string | null;
  }
}
