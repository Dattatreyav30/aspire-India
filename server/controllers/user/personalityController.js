const PersonalityQuestions = require("../../models/user/PersonalityQuestionModel");
const PersonalityOptions = require("../../models/user/PersonalityQnOptionsModel");
const personalityOutcomes = require("../../models/user/PersonalityOutcomeModel");
const PersonalityQnRecModel = require("../../models/user/personalityOutcomeRecModel");
const personalityLogicJump = require("../../models/user/personalityLogicJump");
const personalityResults = require("../../models/user/PersonalityResultsModel");

const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

const personalityQnschema =
  require("../../helpers/validation").PersonalityQnschema;

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
