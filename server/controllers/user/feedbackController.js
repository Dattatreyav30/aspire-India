const feedbackQuestions = require("../../models/user/feedbackquestionsModel");
const feedbackOptions = require("../../models/user/feedbackOptionsModel");
const userFeedback = require("../../models/user/userFeedback");

const { error500, errorHandlerJoi } = require("../../helpers/error");

exports.postFeedbackQnWithOptions = async (req, res) => {
    try {
      const { question, options, day } = req.body;
      const existingQn = await feedbackQuestions.findOne({ where: { question, day } });
  
      if (existingQn) {
        return res.status(400).json({ message: "Question already exists for this day" });
      }
  
      const questionCreate = await feedbackQuestions.create({ question, day });
  
      for (let i = 0; i < options.length; i++) {
        await feedbackOptions.create({
          option: options[i],
          feedbackQuestionId: questionCreate.id,
        });
      }
  
      res.status(200).json({ message: "successful" });
    } catch (err) {
      error500(err, res);
    }
  };
  

exports.postUserFeedback = async (req, res) => {
  try {
    const { questionId, optionId } = req.body;
    await userFeedback.create({
      userId: req.user,
      feedbackOptionId: optionId,
      feedbackQuestionId: questionId,
    });
    res.status(200).json({ message: "succesfull" });
  } catch (err) {
    error500(err, res);
  }
};
