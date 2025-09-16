import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";

const authRouter = Router();

// POST /register - Register new user
authRouter.post("/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "All fields (username, password, firstName, lastName) are required"
      });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user object
    const newUser = {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date()
    };

    // Insert user into database
    const result = await db.collection("users").insertOne(newUser);

    if (result.insertedId) {
      res.status(201).json({
        message: "User has been created successfully"
      });
    } else {
      res.status(500).json({
        message: "Failed to create user"
      });
    }

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

// POST /login - Login user
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // Check if user exists
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    // Create JWT token with user data
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    const token = jwt.sign(userData, "your-secret-key", { expiresIn: "24h" });

    res.status(200).json({
      message: "login successfully",
      token: token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default authRouter;
