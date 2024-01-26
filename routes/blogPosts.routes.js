const { isAuthenticated } = require("../middleware/jwt.middleware");
const BlogPost = require("../models/BlogPost.model");

const router = require("express").Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const allBlogPosts = await BlogPost.find();
    res.status(200).json(allBlogPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting all blog posts" });
  }
});

// GET one
router.get("/:blogPostId", async (req, res) => {
  const { blogPostId } = req.params;

  try {
    const oneBlogPost = await BlogPost.findById(blogPostId);
    res.status(200).json(oneBlogPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting one blog post" });
  }
});

// POST one
router.post("/", isAuthenticated, async (req, res) => {
  const payload = req.body;
  const userId = req.tokenPayload._id;
  payload.author = userId;

  try {
    const createdBlogPost = await BlogPost.create(payload);
    console.log(req.tokenPayload._id);
    res.status(201).json(createdBlogPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while creating a blog post" });
  }
});

// PUT one
router.put("/:blogPostId", isAuthenticated, async (req, res) => {
  const { blogPostId } = req.params;
  const loggedInUserId = req.tokenPayload._id;
  const payload = req.body;

  try {
    const blogPostToUpdate = await BlogPost.findById(blogPostId);
    if (blogPostToUpdate.author == loggedInUserId) {
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        blogPostId,
        payload,
        {
          new: true,
        }
      );
      res.status(200).json(updatedBlogPost);
    } else {
      res
        .status(403)
        .json({ message: "You do not have rights to update this blog post" });
      console.log(blogPostToUpdate);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating the blog post" });
  }
});

// DELETE one
router.delete("/:blogPostId", isAuthenticated, async (req, res) => {
  const { blogPostId } = req.params;
  const loggedInUserId = req.tokenPayload._id;

  try {
    const blogPostToDelete = await BlogPost.findById(blogPostId);
    if (blogPostToDelete.author == loggedInUserId) {
      await BlogPost.findByIdAndDelete(blogPostId);
      res.status(204).json({ message: "Blog post has been deleted" });
    } else {
      res
        .status(403)
        .json({ message: "You do not have rights to delete this blog post " });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while deleting the blog post" });
  }
});

module.exports = router;
