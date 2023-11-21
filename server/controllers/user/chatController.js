const PrecuratedMessages = require("../../models/user/PrecuratedMessagesModel");

const { error500, errorHandlerJoi } = require("../../helpers/error");

const { postPrecuratesMessagesSchema } = req.body;

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
