const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req,res) => {

 const { name,email,password } = req.body;

 const hashedPassword =
 await bcrypt.hash(password,10);

 await pool.query(
 `
 INSERT INTO users(name,email,password)
 VALUES($1,$2,$3)
 `,
 [name,email,hashedPassword]
 );

 res.json({
  message:"User registered"
 });
};

exports.login = async (req,res) => {

 const { email,password } = req.body;

 const result =
 await pool.query(
  "SELECT * FROM users WHERE email=$1",
  [email]
 );

 if(result.rows.length===0){
  return res.status(401).json({
   message:"User not found"
  });
 }

 const user = result.rows[0];

 const valid =
 await bcrypt.compare(
  password,
  user.password
 );

 if(!valid){
  return res.status(401).json({
   message:"Invalid password"
  });
 }

 const token = jwt.sign(
 {
  id:user.id,
  name:user.name,
  email:user.email
 },
 process.env.JWT_SECRET,
 {
  expiresIn:"1d"
 }
 );

 res.json({ token });
};