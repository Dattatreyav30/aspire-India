//community
const CommunityPosts = require("../../models/user/communityPostsModel");
const CommunityPostsLikes = require("../../models/user/communityPostsLikesModel");

//user
const User = require("../../models/user/userModel");

//aws
const { s3, s3ImageParams } = require("../../helpers/controllerFunctions");
const { error500, errorHandlerJoi } = require("../../helpers/error");

const { postLikesSchema } = require("../../helpers/validation");
const actionCompletion = require("../../models/user/actionCompletion");

exports.postCommunityPosts = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { id: req.user },
      transaction: t,
    });
    const imageFile = req.files["image"][0];
    const { title, description } = req.body;
    const imageParams = s3ImageParams(imageFile, "community/uploads/images/");
    const imageS3Response = await s3.upload(imageParams).promise();

    const post = await CommunityPosts.create(
      {
        userName: user.name,
        imageUrlS3: imageS3Response.Location,
        userId: req.user,
        title,
        description,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({ message: "successful", post });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};

exports.postLikes = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { emoji_type, communityPostId } = req.body;

    const { error } = await postLikesSchema.validate(req.body);
    if (error) {
      errorHandlerJoi(error, res);
    }

    const existingLike = await CommunityPostsLikes.findOne({
      where: {
        userId: req.user,
        communityPostId: communityPostId,
      },
      transaction: t,
    });

    if (existingLike) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "User has already liked this post" });
    }

    const like = await CommunityPostsLikes.create(
      {
        userId: req.user,
        communityPostId,
        emoji_type,
      },
      { transaction: t }
    );

    const post = await CommunityPosts.findOne({
      where: { id: communityPostId },
      transaction: t,
    });

    await post.update(
      { likeCount: Number(post.likeCount) + 1 },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({ message: "Like added successfully", like });
  } catch (err) {
    await t.rollback();
    console.log(err);
    error500(err, res);
  }
};

exports.undoLike = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { communityPostId } = req.body;

    const existingLike = await CommunityPostsLikes.findOne({
      where: {
        userId: req.user,
        communityPostId: communityPostId,
      },
      transaction: t,
    });

    if (existingLike) {
      await existingLike.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({ message: "Like undone successfully" });
    } else {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Like not found or already undone" });
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
    error500(err, res);
  }
};

exports.gerCommunityPosts = async (req, res) => {
  const actions = await actionCompletion.findAll();
  res.status(200).json({ message: "succesfull", actions: actions });
};
