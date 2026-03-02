import mysql from "mysql2/promise";
import "dotenv/config";

const setup = async () => {
  let connection;

  try {
    // Connect directly without a database so we can create lrnr first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Create the database if it doesn't exist yet
    await connection.query("CREATE DATABASE IF NOT EXISTS lrnr");
    console.log("Database lrnr ready");

    // Switch into the lrnr database
    await connection.query("USE lrnr");

    // Create the ACCOUNT table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ACCOUNT (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        streak INT DEFAULT 0,
        xp INT DEFAULT 0,
        level INT DEFAULT 1,
        last_quiz_date DATE DEFAULT NULL
      )
    `);
    console.log("ACCOUNT table ready");

    // Create the QUIZ table
    // UNIQUE constraint ensures one best score per user/topic/expertise/question count combo
    await connection.query(`
      CREATE TABLE IF NOT EXISTS QUIZ (
        quiz_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        topic VARCHAR(100) NOT NULL,
        expertise VARCHAR(50) NOT NULL,
        num_of_questions INT NOT NULL,
        best_score INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES ACCOUNT(user_id),
        UNIQUE(user_id, topic, expertise, num_of_questions)
      )
    `);
    console.log("QUIZ table ready");

    console.log("Database setup complete");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

setup();