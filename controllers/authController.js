const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../config/mysql");
const ExternalUser = require("../models/ExternalUser");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) หาจาก MongoDB ก่อน
    let user = await ExternalUser.findOne({ Username: username });

    // 2) ถ้าไม่พบ → โหลดจาก MySQL → hash → เก็บ MongoDB
    if (!user) {
      const [rows] = await mysql.execute(
        "SELECT * FROM User WHERE Username = ? LIMIT 1",
        [username]
      );

      if (rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const rawUser = rows[0];
      const hash = await bcrypt.hash(rawUser.Password, 10);

      user = await ExternalUser.create({
        User_ID: rawUser.User_ID,
        Username: rawUser.Username,
        Password: hash,
        Role: rawUser.Role,
        Dep_ID: rawUser.Dep_ID,
        Fullname: rawUser.Fullname,
      });
    }

    // 3) ตรวจสอบ password (hash ใน Mongo)
    const passOK = await bcrypt.compare(password, user.Password);
    if (!passOK) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4) ออก token
    const token = jwt.sign(
      {
        User_ID: user.User_ID,
        Username: user.Username,
        Role: user.Role,
        Dep_ID: user.Dep_ID,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        User_ID: user.User_ID,
        Username: user.Username,
        Role: user.Role,
        Dep_ID: user.Dep_ID,
        Fullname: user.Fullname,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
