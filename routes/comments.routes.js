const { isAuthenticated } = require("../middleware/jwt.middleware");
const BlogPost = require("../models/BlogPost.model");
const Comment = require("../models/Comment.model");

const router = require("express").Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const allComments = await Comment.find().populate("user");
    res.status(200).json(allComments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting all comments" });
  }
});

// GET one
router.get("/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    const oneComment = await Comment.findById(commentId).populate("user");
    res.status(200).json(oneComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting one comment" });
  }
});

// POST one
router.post("/", isAuthenticated, async (req, res) => {
  const payload = req.body;
  const userId = req.tokenPayload._id;
  payload.user = userId;

  try {
    const createdComment = await Comment.create(payload);
    await Comment.populate(createdComment, {
      path: "user",
      select: "username",
    });
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      payload.blogPost,
      { $push: { comments: createdComment._id } },
      { new: true }
    );
    res.status(201).json(createdComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while creating a comment" });
  }
});

// PUT one
router.put("/:commentId", isAuthenticated, async (req, res) => {
  const { commentId } = req.params;
  const loggedInUserId = req.tokenPayload._id;
  const payload = req.body;

  try {
    const commentToUpdate = await Comment.findById(commentId);
    if (commentToUpdate.user == loggedInUserId) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        payload,
        {
          new: true,
        }
      );
      res.status(200).json(updatedComment);
    } else {
      res
        .status(403)
        .json({ message: "You do not have rights to update this comment" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating the comment" });
  }
});

// DELETE one
router.delete("/:commentId", isAuthenticated, async (req, res) => {
  const { commentId } = req.params;
  const loggedInUserId = req.tokenPayload._id;

  try {
    const commentToDelete = await Comment.findById(commentId);
    if (commentToDelete.user == loggedInUserId) {
      await Comment.findByIdAndDelete(commentId);
      res.status(204).json({ message: "Comment has been deleted" });
    } else {
      res
        .status(403)
        .json({ message: "You do not have rights to delete this comment" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while deleting the comment" });
  }
});

module.exports = router;
