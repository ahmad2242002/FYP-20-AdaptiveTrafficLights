import mysql from 'mysql2/promise';
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stlcs',
};

export  const connectMysql = async () => {
  try {

    return await mysql.createConnection(dbConfig);
   
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
  }
};

export default connectMysql