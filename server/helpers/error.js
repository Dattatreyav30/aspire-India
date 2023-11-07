const errorHandlerJoi = (error,res) => {
  return res
    .status(400)
    .json({ error: "Validation error", details: error.details });
};
