import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const jwtSecret = process.env.JWT_SECRET!;

  if (email !== adminEmail)
    return NextResponse.json({ message: "Invalid email" }, { status: 401 });

  const isValid = await bcrypt.compare(password, adminPassword);
  if (!isValid)
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: "2h" });

  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 60 * 60, // 2 hours
    path: "/",
  });

  return response;
}
