//community
const CommunityPosts = require("../../models/user/CommunityPostsModel");
const CommunityPostsLikes = require("../../models/user/CommunityPostsLikesModel");

//user
const User = require("../../models/user/UserModel");

//aws
const { s3, s3ImageParams } = require("../../helpers/controllerFunctions");
const { error500 } = require("../../helpers/error");

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
    res.status(200).json({ post, imageS3Response });
  } catch (err) {
    error500(err, res);
  }
};
