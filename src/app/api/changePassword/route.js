// pages/api/signup.js
var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
import connectMysql from "../../../../lib/mysqlcon";
import { NextResponse } from "next/server";

export async function POST(request) {
    console.log("hello");
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not Allowed" }, { status: 405 });
  }
  console.log("hello2");
  console.log(request);
  const { email,password } = await request.json();
  console.log(email,password);

  try {
    // Connect to your MySQL database
    const connection = await connectMysql();

    // Check if the email is already registered
    const emailExists = await checkEmailExists(connection, email);

    if (!emailExists) {
        return NextResponse.json({ error: "Email not exists" }, { status: 400 });
    }

    // Hash the password before storing it in the database
    
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert the user data into the database
    const result = await change(connection, email, hashedPassword);

    if (result) {
        return NextResponse.json({ message: "Password Change successfully" }, { status: 201 });
    } else {
        return NextResponse.json({ error: "Failed to Change Password of user" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during password changing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function checkEmailExists(connection, email) {
  // Query to check if the email is already registered
  const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
  return rows.length > 0;
}

async function change(connection, email, password) {
  // Query to insert user data into the database
  const [result] = await connection.execute(
    'UPDATE user SET password = ? WHERE email = ?',
    [password, email]
  );  
  return result.affectedRows === 1;
}