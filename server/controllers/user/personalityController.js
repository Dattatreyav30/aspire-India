const PersonalityQuestions = require("../../models/user/personalityQuestionModel");
const PersonalityOptions = require("../../models/user/personalityQnOptionsModel");
const personalityOutcomes = require("../../models/user/personalityOutcomeModel");
const PersonalityQnRecord = require("../../models/user/personalityQnRecModel");
const personalityLogicJump = require("../../models/user/personalityLogicJump");
const personalityResults = require("../../models/user/personalityResultsModel");

const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;
const sequelize = require("../../util/database");

//joi validation
const personalityQnschema =
  require("../../helpers/validation").PersonalityQnschema;
const postQnLogicJump =
  require("../../helpers/validation").postQnLogicJumpschema;

const postPersonalityOutcomes =
  require("../../helpers/validation").personalityOutcomeSchema;

const personalityRecSchema =
  require("../../helpers/validation").personalityRecschema;

exports.postPersonalityQuestion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { questionName, optionNames } = req.body;

    const { error } = personalityQnschema.validate(req.body);

    if (error) {
      await t.rollback();
      errorForJoi(error, res);
    }

    const personalityQuestion = await PersonalityQuestions.create(
      {
        questionName,
      },
      { transaction: t }
    );

    for (let i = 0; i < optionNames.length; i++) {
      await PersonalityOptions.create(
        {
          optionName: optionNames[i],
          personalityQuestionId: personalityQuestion.id,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({ message: "successful" });
  } catch (err) {
    await t.rollback();
    console.log(err);
    error500(err, res);
  }
};

exports.postQnsWithLogicJumps = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { questionName, options } = req.body;

    const { error } = postQnLogicJump.validate(req.body);

    if (error) {
      await t.rollback();
      errorForJoi(error, res);
    }

    const personalityQuestion = await PersonalityQuestions.create(
      {
        questionName,
        isLogicJump: true,
      },
      { transaction: t }
    );

    for (let i = 0; i < options.length; i++) {
      const personalityOption = await PersonalityOptions.create(
        {
          optionName: options[i].option,
          personalityQuestionId: personalityQuestion.id,
        },
        { transaction: t }
      );

      await personalityLogicJump.create(
        {
          option_id: personalityOption.id,
          to_question_id: options[i].logicJumpId || null,
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

exports.postPersonalityOutcomes = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { outcomeName } = req.body;
    const { error } = postPersonalityOutcomes.validate(req.body);

    if (error) {
      await t.rollback();
      errorForJoi(err, res);
    }

    await personalityOutcomes.create(
      {
        outcomeName,
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

exports.postPersonalityRecords = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { questionAnsIds } = req.body;
    const { error } = personalityRecSchema.validate(req.body);

    if (error) {
      await t.rollback();
      errorForJoi(error, res);
    }

    for (let i = 0; i < questionAnsIds.length; i++) {
      await PersonalityQnRecord.create(
        {
          personalityQuestionId: questionAnsIds[i].personalityQuestionId,
          personalityOptionId: questionAnsIds[i].personalityOptionId,
          userId: req.user,
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

exports.getPersonalityQuestionsOptions = async (req, res) => {
  try {
    const personalityQuestionsWithOptions = await PersonalityQuestions.findAll({
      include: PersonalityOptions,
    });

    res.status(200).json({ personalityQuestionsWithOptions });
  } catch (err) {
    error500(err, res);
  }
};
