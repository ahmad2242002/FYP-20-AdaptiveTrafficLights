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
  const { email, name, cnic, password } = await request.json();
  console.log(email,name,cnic,password);

  try {
    // Connect to your MySQL database
    const connection = await connectMysql();

    // Check if the email is already registered
    const emailExists = await checkEmailExists(connection, email);

    if (emailExists) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash the password before storing it in the database
    
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert the user data into the database
    const result = await createUser(connection, email, name, cnic, hashedPassword);

    if (result) {
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } else {
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function checkEmailExists(connection, email) {
  // Query to check if the email is already registered
  const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
  return rows.length > 0;
}

async function createUser(connection, email, name, cnic, password) {
  // Query to insert user data into the database
  const [result] = await connection.execute(
    'INSERT INTO user (email, name, cnic, password) VALUES (?, ?, ?, ?)',
    [email, name, cnic, password]
  );
  return result.affectedRows === 1;
}
