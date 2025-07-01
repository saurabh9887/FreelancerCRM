import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const q = `SELECT * FROM users WHERE email=?`;

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(401).json("User does not exist");

    if (req.body.password !== data[0].password) {
      return res.status(400).json("Incorrect Credentials");
    }

    const { password, ...other } = data[0];

    const token = jwt.sign({ id: data[0].userKeyID }, "jwtKey");

    const responseData = {
      ...other, // name, email, role, etc.
      token, // Add token to same object
    };

    res.status(200).json(responseData);
  });
};
