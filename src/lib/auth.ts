import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("아이디와 비밀번호를 입력해주세요.");
        }

        const username = credentials.username as string;
        const password = credentials.password as string;
        const db = getDb();

        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;

        if (!user) {
          throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // Check account lock (brute-force protection)
        if (user.locked_until) {
          const lockTime = new Date(user.locked_until).getTime();
          if (Date.now() < lockTime) {
            const remaining = Math.ceil((lockTime - Date.now()) / 60000);
            throw new Error(`로그인 시도 초과. ${remaining}분 후 다시 시도해주세요.`);
          }
          // Lock expired — reset
          db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?").run(user.id);
          user.failed_attempts = 0;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
          const newAttempts = (user.failed_attempts || 0) + 1;

          if (newAttempts >= 5) {
            // Lock for 15 minutes
            const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
            db.prepare("UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?")
              .run(newAttempts, lockUntil, user.id);
            throw new Error("로그인 5회 실패. 15분 후 다시 시도해주세요.");
          }

          db.prepare("UPDATE users SET failed_attempts = ? WHERE id = ?")
            .run(newAttempts, user.id);
          throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // Login success — reset failed attempts, update last_login
        db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = datetime('now', 'localtime') WHERE id = ?")
          .run(user.id);

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          church: user.church,
          position: user.position,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.church = user.church;
        token.position = user.position;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.church = token.church as string | null;
        session.user.position = token.position as string | null;
      }
      return session;
    },
  },
});
