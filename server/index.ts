import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from "express"
import mysql, { ResultSetHeader } from "mysql2"
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

        const tasksTable = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255),
            notes TEXT,
            category VARCHAR(100),
            status VARCHAR(50),
            date DATETIME,
            done BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;

        db.query(createTableQuery, (err) => {
            if (err) console.error("Error creating table:", err.message);
            else console.log("Users table verified/created.");
        });
        db.query(tasksTable, (err) => {
            if (err) console.error("Error creating table:", err.message)
            else console.log("Tasks table verified/created.")
        })
    }
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server körs på http://localhost:${PORT}`)
})

/* ------------------------------------------------------------- */

interface CustomRequest extends Request {
    currentUserId?: number
}

const requireUser = (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.headers['user-id']; // Frontend will send this
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    req.currentUserId = Number(userId);
    next();
};


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

        const header = result as ResultSetHeader

        console.log("User registered successfully!")
        res.status(201).json({ message: "User created!", userId: header.insertId })
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
            res.status(200).json({ message: "Login successful", userId: user.id })
        } else {
            console.log("Login failed: Wrong password for: ", email)
            res.status(401).json({ message: "Invalid Password" });
        }
    });

    app.get("/api/tasks", requireUser, (req: CustomRequest, res: Response) => {
        db.query("SELECT * FROM tasks WHERE user_id = ?", [req.currentUserId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message })
            res.json(results)
        })
    })
    app.post("/api/tasks", requireUser, (req: CustomRequest, res: Response) => {
        const { title, notes, category, status, date, done } = req.body
        const query = "INSERT INTO tasks (user_id, title, notes, category, status, date, done) VALUES (?, ?, ?, ?, ?, ?, ?)"


        db.query(query, [req.currentUserId, title, notes, category, status, new Date(date), done], (err, result: any) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, message: "Task added" });
        })
    })


    app.put("/api/tasks/:id", requireUser, (req: CustomRequest, res: Response) => {
        const { title, notes, category, status, date, done } = req.body;
        const query = `UPDATE tasks SET title=?, notes=?, category=?, status=?, date=?, done=? 
        WHERE id=? AND user_id=?`;

        db.query(query, [title, notes, category, status, new Date(date), done, req.params.id, req.currentUserId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Task updated" });
        });
    });
    app.delete("/api/tasks/:id", requireUser, (req: CustomRequest, res: Response) => {
        db.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.currentUserId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Task deleted" });
        });
    });

    const PORT = 5000
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
});