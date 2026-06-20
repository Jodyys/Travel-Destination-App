const pool = require("../config/db");

exports.addFavorite = async (req, res) => {

const { destination_id } = req.body;

await pool.query(
`  INSERT INTO favorites
 (
  user_id,
  destination_id
 )
 VALUES($1,$2)
 `,
[
req.user.id,
destination_id
]
);

res.json({
message: "Favorite added"
});
};

exports.getFavorites = async (req, res) => {

const result = await pool.query(
`  SELECT
  f.id,
  d.title,
  d.location,
  d.image_url
 FROM favorites f
 JOIN destinations d
 ON d.id = f.destination_id
 WHERE f.user_id = $1
 `,
[req.user.id]
);

res.json(result.rows);
};

exports.deleteFavorite =
async(req,res)=>{

 const { id } = req.params;

 await pool.query(
 `
 DELETE FROM favorites
 WHERE id=$1
 `,
 [id]
 );

 res.json({
  message:"Favorite deleted"
 });
};