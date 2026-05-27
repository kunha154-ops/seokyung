"use server";

import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

const SALT_ROUNDS = 12;

// Password validation: min 8 chars, uppercase, lowercase, number, special char
function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "비밀번호는 최소 8자 이상이어야 합니다.";
  }
  if (!/[A-Z]/.test(password)) {
    return "비밀번호에 영문 대문자를 1개 이상 포함해야 합니다.";
  }
  if (!/[a-z]/.test(password)) {
    return "비밀번호에 영문 소문자를 1개 이상 포함해야 합니다.";
  }
  if (!/[0-9]/.test(password)) {
    return "비밀번호에 숫자를 1개 이상 포함해야 합니다.";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    return "비밀번호에 특수문자를 1개 이상 포함해야 합니다.";
  }
  return null;
}

// Username validation: 4-20 chars, alphanumeric + underscore only
function validateUsername(username: string): string | null {
  if (username.length < 4 || username.length > 20) {
    return "아이디는 4~20자로 입력해주세요.";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.";
  }
  return null;
}

export async function registerUser(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const church = (formData.get("church") as string)?.trim() || null;
  const position = (formData.get("position") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;

  // Required fields
  if (!username || !password || !passwordConfirm || !name) {
    return { error: "모든 필수 필드를 입력해주세요." };
  }

  // Name validation
  if (name.length < 2 || name.length > 20) {
    return { error: "이름은 2~20자로 입력해주세요." };
  }

  // Username validation
  const usernameError = validateUsername(username);
  if (usernameError) {
    return { error: usernameError };
  }

  // Password validation
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  // Password confirmation
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  const db = getDb();

  // Check duplicate username
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (existing) {
    return { error: "이미 사용 중인 아이디입니다." };
  }

  // Hash password with high salt rounds
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user (default status is pending from schema)
  try {
    db.prepare(
      "INSERT INTO users (username, password_hash, name, email, church, position, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')"
    ).run(username, passwordHash, name, email, church, position, phone);

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." };
  }
}

export async function checkUsername(username: string) {
  const error = validateUsername(username);
  if (error) return { available: false, message: error };

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);

  if (existing) {
    return { available: false, message: "이미 사용 중인 아이디입니다." };
  }
  return { available: true, message: "사용 가능한 아이디입니다." };
}
