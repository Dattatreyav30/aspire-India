const errorHandlerJoi = (error,res) => {
  return res
    .status(400)
    .json({ error: "Validation error", details: error.details });
};
const error500 = (error,res)=>{
 return res.status(500).json({ message: error.message });
}
module.exports = {
  errorHandlerJoi,
  error500
}