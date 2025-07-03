const mysql = require('mysql2/promise');

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log(`MySQL Connected: ${process.env.MYSQL_HOST}`);
    return connection;
  } catch (err) {
    console.error(`MySQL Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
