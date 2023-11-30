const feedbackQuestions = require("../../models/user/feedbackquestionsModel");
const feedbackOptions = require("../../models/user/feedbackOptionsModel");
const userFeedback = require("../../models/user/userFeedback");

const { error500, errorHandlerJoi } = require("../../helpers/error");

exports.postFeedbackQnWithOptions = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { question, options, day } = req.body;
    const existingQn = await feedbackQuestions.findOne({
      where: { question, day },
      transaction: t,
    });

    if (existingQn) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Question already exists for this day" });
    }

    const questionCreate = await feedbackQuestions.create(
      { question, day },
      { transaction: t }
    );

    for (let i = 0; i < options.length; i++) {
      await feedbackOptions.create(
        {
          option: options[i],
          feedbackQuestionId: questionCreate.id,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({ message: "successful" });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};

exports.postUserFeedback = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { feedbackQuestionId, feedbackOptionId, programId, actionId } =
      req.body;

    const existingFeedback = await userFeedback.findOne({
      where: {
        userId: req.user,
        feedbackQuestionId,
        actionId,
        programId,
      },
      transaction: t,
    });

    if (existingFeedback) {
      await t.rollback();
      return res.status(400).json({ message: "Feedback already exists" });
    }

    await userFeedback.create(
      {
        userId: req.user,
        feedbackOptionId: feedbackOptionId,
        feedbackQuestionId: feedbackQuestionId,
        actionId,
        programId,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({ message: "successful" });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};
