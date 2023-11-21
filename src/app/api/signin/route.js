// pages/api/signin.js
import connectMysql from "../../../../lib/mysqlcon";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const connection = await connectMysql();
  if (connection) {
    try {
      console.log("Connection Successfully");
      const { email, password } = await request.json();
      console.log(email, password);
      console.log("Connection Successfully");
      const hashedPassword = await getPasswordByEmail(connection, email);

      if (!hashedPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      console.log("hello:" + password);
      // Compare the entered password with the stored hash
      const passwordMatch = bcrypt.compareSync(password, hashedPassword);
      console.log(passwordMatch);

      // Query to check user credentials (replace with your actual query)
      if (passwordMatch) {
        console.log("user found");
        // Successful sign-in
        return NextResponse.json({ message: "Sign-in successful" }, { status: 200 });
      } else {
        // Invalid credentials
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function getPasswordByEmail(connection, email) {
  // Query to retrieve the hashed password from the database based on the email
  const [rows] = await connection.execute('SELECT password FROM user WHERE email = ?', [email]);
  console.log(rows[0]?.password);
  return rows.length > 0 ? rows[0].password : null;
}
