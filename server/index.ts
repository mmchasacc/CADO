import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Request, Response } from "express"
import mysql from "mysql2"
import cors from "cors"
import dotenv from "dotenv"


dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
})


db.connect((err) => {
    if (err) {
        console.error("Couldn't connect to MySQL-Aiven", err)
        return
    } else {
        console.log("Succesfully connected to MySQL through TS-CADO")
        const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

        db.query(createTableQuery, (err) => {
            if (err) console.error("Error creating table:", err.message);
            else console.log("Users table verified/created.");
        });
    }
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server körs på http://localhost:${PORT}`)
})

/* ------------------------------------------------------------- */

// --- SIGNUP (Skapa konto) ---
app.post('/api/signup', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." })
    }

    const query = "INSERT INTO users (email, password) VALUES (?, ?)"

    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error("Signup error:", err)

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Email already registered" })
            }
            return res.status(500).json({ message: "Database error" })
        }

        console.log("User registered successfully!")
        res.status(201).json({ message: "User created!" })
    })
});


app.post("/api/login", (req: Request, res: Response) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (err, results: any) => {
        if (err) {
            console.error("Database Error: ", err)
            return res.status(500).json({ message: "Database error" });
        }

        if (!results || results.length === 0) {
            console.log("Login failed: No user found with email:", email)
            return res.status(401).json({ message: "User not found" })
        }

        const user = results[0];

        if (user.password === password) {
            console.log("Login succesful for:", email)
            res.status(200).json({ message: "Login successful" })
        } else {
            console.log("Login failed: Wrong password for: ", email)
            res.status(401).json({ message: "Invalid Password" });
        }
    });
});