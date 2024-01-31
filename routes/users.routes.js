const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

const router = require("express").Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find().populate("blogPosts");
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting all users" });
  }
});

// GET one
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const oneUser = await User.findById(userId);
    res.status(200).json(oneUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting one user" });
  }
});

// GET all posts from user
router.get("/:userId/art", async (req, res) => {
  const { userId } = req.params;
  console.log(`USERID: ${userId}`);
  try {
    const user = await User.findById(userId).populate("blogPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT one
router.put("/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.tokenPayload._id;
  const payload = req.body;

  try {
    const userToUpdate = await User.findById(userId);
    if (userToUpdate._id == loggedInUserId) {
      const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } else {
      res
        .status(403)
        .json({ message: "You do not have rights to update this user " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating the user" });
  }
});

// DELETE one
router.delete("/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.tokenPayload._id;

  try {
    const userToDelete = await User.findById(userId);
    if (userToDelete._id == loggedInUserId) {
      await User.findByIdAndDelete(userId);
      res.status(204).json({ message: "User has been deleted" });
    } else {
      res
        .status(403)
        .json({ message: "You do not have rights to delete this user " });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while deleting the user" });
  }
});

module.exports = router;
