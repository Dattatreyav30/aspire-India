const PrecuratedMessages = require("../../models/user/PrecuratedMessagesModel");

const { error500, errorHandlerJoi } = require("../../helpers/error");

const { postPrecuratesMessagesSchema } = require("../../helpers/validation");

exports.postPrecuratedMessages = async (req, res) => {
  try {
    const { message } = req.body;
    const { error } = postPrecuratesMessagesSchema.validate(req.body);
    if (error) {
      errorHandlerJoi(error, res);
    }
    const postMessage = await PrecuratedMessages.create({
      messageName: message,
    });

    res.status(200).json({ message: "succesfull", postMessage });
  } catch (err) {
    error500(err, res);
  }
};

exports.getPrecuratedMessages = async (req, res) => {
  try {
    let precurateMsg = await PrecuratedMessages.findAll();
    return res.status(200).send({ message: "successful", precurateMsg });
  } catch (err) {
    error500(err, res);
  }
};
