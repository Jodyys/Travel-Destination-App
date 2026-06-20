const pool = require("../config/db");

exports.getAll = async(req,res)=>{

const result =
await pool.query(
"SELECT * FROM destinations ORDER BY id DESC"
);

res.json(result.rows);
};

exports.create = async(req,res)=>{

const {
title,
location,
category,
description,
image_url
} = req.body;

await pool.query(
`  INSERT INTO destinations
 (
  title,
  location,
  category,
  description,
  image_url
 )
 VALUES ($1,$2,$3,$4,$5)
 `,
[
title,
location,
category,
description,
image_url
]
);

res.json({
message:"Destination created"
});
};

exports.getById = async(req,res)=>{

const { id } = req.params;

const result =
await pool.query(
"SELECT * FROM destinations WHERE id=$1",
[id]
);

if(result.rows.length===0){
return res.status(404).json({
message:"Destination not found"
});
}

res.json(result.rows[0]);
};

exports.update = async(req,res)=>{

const { id } = req.params;

const {
title,
location,
category,
description,
image_url
} = req.body;

await pool.query(
`  UPDATE destinations
 SET
 title=$1,
 location=$2,
 category=$3,
 description=$4,
 image_url=$5
 WHERE id=$6
 `,
[
title,
location,
category,
description,
image_url,
id
]
);

res.json({
message:"Destination updated"
});
};

exports.remove = async(req,res)=>{

const { id } = req.params;

await pool.query(
`  DELETE FROM destinations
 WHERE id=$1
 `,
[id]
);

res.json({
message:"Destination deleted"
});
};
