const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ✅ SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;  // ✅ Ensure email & password are received

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;  // ✅ Get email & password from request
  
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ token, user: { id: user._id, email: user.email, highScore: user.highScore } });
  
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
