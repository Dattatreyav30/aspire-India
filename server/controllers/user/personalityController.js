const PersonalityQuestions = require("../../models/user/PersonalityQuestionModel");
const PersonalityOptions = require("../../models/user/PersonalityQnOptionsModel");
const personalityOutcomes = require("../../models/user/PersonalityOutcomeModel");
const PersonalityQnRecord = require("../../models/user/PersonalityQnRecModel");
const personalityLogicJump = require("../../models/user/personalityLogicJump");
const personalityResults = require("../../models/user/PersonalityResultsModel");

const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

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
  try {
    const { questionName, optionNames } = req.body;

    const { error } = personalityQnschema.validate(req.body);

    if (error) {
      errorForJoi(error, res);
    }
    const personalityQuestion = await PersonalityQuestions.create({
      questionName,
    });

    for (let i = 0; i < optionNames.length; i++) {
      await PersonalityOptions.create({
        optionName: optionNames[i],
        personalityQuestionId: personalityQuestion.id,
      });
    }
    res.status(200).json({ message: "succesfull" });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

exports.postQnsWithLogicJumps = async (req, res) => {
  //let say he is typing question and let he choose the logic jump question from the list of the questions

  //quesion name , array of options and logic jump option id

  try {
    const { questionName, options } = req.body;

    const { error } = postQnLogicJump.validate(req.body);

    if (error) {
      errorForJoi(error, res);
    }

    const personalityQuestion = await PersonalityQuestions.create({
      questionName,
      isLogicJump: true,
    });

    for (let i = 0; i < options.length; i++) {
      const personalityOption = await PersonalityOptions.create({
        optionName: options[i].option,
        personalityQuestionId: personalityQuestion.id,
      });
      await personalityLogicJump.create({
        option_id: personalityOption.id,
        to_question_id: options[i].logicJumpId || null,
      });
    }

    res.status(200).json({ message: "succesfull" });
  } catch (err) {
    error500(err, res);
  }
};

exports.postPersonalityOutcomes = async (req, res, next) => {
  try {
    const { outcomeName } = req.body;
    const { error } = postPersonalityOutcomes.validate(req.body);

    if (error) {
      errorForJoi(err, res);
    }
    await personalityOutcomes.create({
      outcomeName,
    });
    res.status(200).json({ messsage: "successfull" });
  } catch (err) {
    error500(err, res);
  }
};

exports.postPersonalityRecords = async (req, res) => {
  try {
    const { questionAnsIds } = req.body;
    const { error } = personalityRecSchema.validate(req.body);
    if (error) {
      errorForJoi(error, res);
    }

    // console.log(questionAnsIds)
    for (let i = 0; i < questionAnsIds.length; i++) {
      console.log(questionAnsIds[i].personalityOptionId);
      await PersonalityQnRecord.create({
        personalityQuestionId: questionAnsIds[i].personalityQuestionId,
        personalityOptionId: questionAnsIds[i].personalityOptionId,
        userId: req.user,
      });
    }
    res.status(200).json({ message: "successfull" });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};
