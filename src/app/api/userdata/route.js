import connectMysql from "../../../../lib/mysqlcon";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await connectMysql();
  if (connection) {
    try {
      console.log("Connection Successfully");
      const userData  = await getUserData(connection);

      if (!userData) {
        return NextResponse.json(
          { error: "No UserData" },
          { status: 401 }
        );
      }
      else
      {
        return NextResponse.json([userData], { status: 200 });
      }
      
    } catch (error) {
      console.error("Error during getting Data:", error);
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

async function getUserData(connection) {
  // Query to retrieve all user data from the database based on the email
  const [rows] = await connection.execute(`SELECT * FROM user where role = 'analyzer'`);
  return rows.length > 0 ? rows : null;
}
