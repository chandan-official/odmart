import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
    };
    if (decoded.email !== process.env.ADMIN_EMAIL)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isMatch = await bcrypt.compare(
      oldPassword,
      process.env.ADMIN_PASSWORD!
    );
    if (!isMatch)
      return NextResponse.json(
        { message: "Old password incorrect" },
        { status: 400 }
      );

    // ⚠️ Store new password hash securely (in DB or rotate env variable)
    const newHash = await bcrypt.hash(newPassword, 10);
    console.log("New password hash:", newHash); // later save in DB

    return NextResponse.json({ message: "Password updated (hash logged)" });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
