const feedbackQuestions = require("../../models/user/feedbackquestionsModel");
const feedbackOptions = require("../../models/user/feedbackOptionsModel");
const userFeedback = require("../../models/user/userFeedback");

const { error500, errorHandlerJoi } = require("../../helpers/error");

exports.postFeedbackQnWithOptions = async (req, res) => {
  try {
    const { question, options, day } = req.body;
    const existingQn = await feedbackQuestions.findOne({
      where: { question, day },
    });

    if (existingQn) {
      return res
        .status(400)
        .json({ message: "Question already exists for this day" });
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
      const { feedbackQuestionId, feedbackOptionId, programId, actionId } = req.body;
      
      // Check if the entry already exists based on userId, feedbackOptionId, and feedbackQuestionId
      const existingFeedback = await userFeedback.findOne({
        where: {
          userId: req.user,
          feedbackQuestionId,
          actionId,
          programId
        },
      });
  
      if (existingFeedback) {
        return res.status(400).json({ message: "Feedback already exists" });
      }
  
      // If the entry doesn't exist, create a new one
      await userFeedback.create({
        userId: req.user,
        feedbackOptionId: feedbackOptionId,
        feedbackQuestionId: feedbackQuestionId,
        actionId,
        programId,
      });
  
      res.status(200).json({ message: "successful" });
    } catch (err) {
      error500(err, res);
    }
  };
  