import mysql, { RowDataPacket } from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "quickhire_db",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let initPromise: Promise<void> | null = null;

async function initializeDatabase() {
  console.log("Initializing database tables...");
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      category_id INT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  // Seed categories
  const [existingCategories] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM categories");
  if ((existingCategories[0] as any).count === 0) {
    const categories = [
      "Design",
      "Sales",
      "Marketing",
      "Finance",
      "Technology",
      "Engineering",
      "Business",
      "Human Resource"
    ];
    const values = categories.map(cat => [cat]);
    await pool.query("INSERT INTO categories (name) VALUES ?", [values]);
    console.log("Categories seeded");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin','user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      resume_link VARCHAR(500) NOT NULL,
      cover_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE
    );
  `);

  console.log("Database initialized");
}

export async function getDb() {
  if (!initPromise) {
    initPromise = initializeDatabase();
  }
  await initPromise;
  return pool;
}

export { pool };

