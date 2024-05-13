import connectMysql from "../../../../lib/mysqlcon";
import { NextResponse } from "next/server";

export async function POST(request) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not Allowed" }, { status: 405 });
  }
  const { email, role } = await request.json();
  console.log(email, role);

  try {
    // Connect to your MySQL database
    const connection = await connectMysql();

    // Check if the email is already registered
    const emailExists = await checkEmailExists(connection, email);

    if (!emailExists) {
      return NextResponse.json({ error: "Email not exists" }, { status: 400 });
    }

    const result = await change(connection, email, role);

    if (result) {
      return NextResponse.json(
        { message: "Role Change successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to Change Role of user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during Role changing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function checkEmailExists(connection, email) {
  // Query to check if the email is already registered
  const [rows] = await connection.execute(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );
  return rows.length > 0;
}

async function change(connection, email, role) {
  const [result] = await connection.execute(
    "UPDATE user SET role = ? WHERE email = ?",
    [role, email]
  );
  return result.affectedRows === 1;
}
