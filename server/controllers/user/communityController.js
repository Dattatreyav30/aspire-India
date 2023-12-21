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

const sequelize = require("../../util/database");

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
    const { communityPostId } = req.body;

    // const { error } = await postLikesSchema.validate(req.body);
    // if (error) {
    //   errorHandlerJoi(error, res);
    // }

    const existingLike = await CommunityPostsLikes.findOne({
      where: {
        userId: req.user,
        ActionCompletionId: communityPostId,
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
        ActionCompletionId: communityPostId,
      },
      { transaction: t }
    );

    const post = await actionCompletion.findOne({
      where: { id: communityPostId },
      transaction: t,
    });

    await post.update(
      { likesCount: Number(post.likesCount) + 1 },
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
    error500(err, res);
  }
};

exports.getCommunityPosts = async (req, res) => {
  try {
    const actions = await actionCompletion.findAll();
    const userIds = actions.map((action) => action.userId);

    const users = await User.findAll(
      { where: { id: userIds } },
      { attributes: ["profile_picture", "name", "createdAt", "updatedAt"] }
    );

    const actionsWithUsers = actions.map((action) => {
      const user = users.find((user) => user.id === action.userId);
      return {
        ...action.toJSON(),
        user: user || null,
      };
    });
    res.status(200).json({ message: "successful", actions: actionsWithUsers });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const { communityPostId } = req.body;

    // Find user IDs who liked the specific community post
    const likes = await CommunityPostsLikes.findAll({
      attributes: ["userId"], // Fetch only the userId column
      where: { ActionCompletionId: communityPostId },
    });

    const userIds = likes.map((like) => like.userId); // Extract user IDs from likes

    // Fetch user details based on user IDs from the Users model/table
    const userLikes = await User.findAll({
      where: { id: userIds }, // Fetch users whose IDs match the liked IDs
    });

    res.status(200).json({ userLikes });
  } catch (err) {
    // Handle errors appropriately
    error500(err, res);
  }
};
