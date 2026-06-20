module.exports = (
 req,
 res,
 next
)=>{

 const {
  title,
  location
 } = req.body;

 if(!title || !location){

  return res.status(400).json({
   message:
   "Title and location required"
  });

 }

 next();
};