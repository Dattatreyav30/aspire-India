const followersModel = require("../../models/user/followersModel");

const followerReqModel = require("../../models/user/followerReqModel");
const User = require("../../models/user/userModel");
const { error500 } = require("../../helpers/error");

const sequelize = require("../../util/database");

exports.sendFollowerReq = async (req, res) => {
  try {
    const userId = req.user;
    const { requesteeId } = req.body;

    // Check if the request already exists
    const existingRequest = await followerReqModel.findOne({
      requesterId: userId,
      requesteeId: requesteeId,
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already exists" });
    }
    const createRequest = await followerReqModel.create({
      requesterId: userId,
      requesteeId: requesteeId,
    });
    res.status(201).json({
      message: "Request created successfully",
      request: createRequest,
    });
  } catch (err) {
    error500(err, res);
  }
};

exports.respondFollowerRequest = async (req, res) => {
  try {
    //requester id is the one sent the requwest
    const { response, requesterId } = req.body;
    const userId = req.user;

    if (response === "accepted") {
      // Find requester and requestee
      const findRequester = await User.findOne({ where: { id: requesterId } });
      const findRequestee = await User.findOne({ where: { id: userId } });

      if (!findRequester || !findRequestee) {
        return res.status(404).json({ error: "User not found" });
      }

      // Begin transaction for atomic operations
      const transaction = await sequelize.transaction();

      try {
        // Add follower
        const existingFollower = await followersModel.findOne({
          where: { userId: userId, follower_id: requesterId },
        });
        if (existingFollower) {
          return res.status(400).json({ error: "he is already follower" });
        }
        await followersModel.create(
          {
            userName: findRequestee.name,
            followerName: findRequester.name,
            userId: userId,
            follower_id: requesterId,
          },
          { transaction }
        );

        // Delete request entry in the follower request table
        await followerReqModel.destroy({
          where: { requesteeId: userId },
          transaction,
        });

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: "Request accepted successfully" });
      } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        throw error; // Throw the error for global error handling
      }
    } else {
      // If the response is not 'accepted', you might handle it here;
      await followerReqModel.destroy({
        where: { requesteeId: userId },
        transaction,
      });
      res.status(200).json({ error: "Invalid response" });
    }
  } catch (err) {
    error500(err, res);
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const userId = req.user;
    const pageSize = 10; // Adjust as needed - number of followers per page
    const skip = (page - 1) * pageSize;

    // Fetch followers for the given userId with pagination
    const followers = await followersModel.findAll({
      where: { userId: userId },
      offset: skip,
      limit: pageSize,
    });

    res.status(200).json(followers); // Send the followers as JSON response
  } catch (err) {
    console.error('Error fetching followers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};