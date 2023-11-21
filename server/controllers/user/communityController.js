//community
const CommunityPosts = require("../../models/user/CommunityPostsModel");
const CommunityPostsLikes = require("../../models/user/CommunityPostsLikesModel");

//user
const User = require("../../models/user/UserModel");

//aws
const { s3, s3ImageParams } = require("../../helpers/controllerFunctions");
const { error500, errorHandlerJoi } = require("../../helpers/error");

const { postLikesSchema } = require("../../helpers/validation");

exports.postCommunityPosts = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user } });
    const imageFile = req.files["image"][0];
    const imageParams = s3ImageParams(imageFile, "community/uploads/images/");
    const imageS3Response = await s3.upload(imageParams).promise();
    const post = await CommunityPosts.create({
      userName: user.name,
      imageUrlS3: imageS3Response.Location,
      userId: req.user,
    });
    res.status(200).json({ message: "successfull", post });
  } catch (err) {
    error500(err, res);
  }
};

exports.postLikes = async (req, res) => {
  try {
    const { emoji_type, communityPostId } = req.body;

    // Check if the user has already liked the post

    const { error } = await postLikesSchema.validate(req.body);
    if(error){
        errorHandlerJoi(error,res)
    }
    const existingLike = await CommunityPostsLikes.findOne({
      where: {
        userId: req.user,
        communityPostId: communityPostId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "User has already liked this post" });
    }

    // Create the like if it doesn't exist
    const like = await CommunityPostsLikes.create({
      userId: req.user,
      communityPostId,
      emoji_type,
    });

    // Handle successful creation
    res.status(200).json({ message: "Like added successfully", like });
  } catch (err) {
    // Handle errors
    console.log(err);
    error500(err, res);
  }
};
