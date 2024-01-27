const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const usersRouter = require("./users.routes");
router.use("/users", usersRouter);

const blogPostsRouter = require("./blogPosts.routes");
router.use("/blog", blogPostsRouter);

const commentsRouter = require("./comments.routes");
router.use("/comments", commentsRouter);

module.exports = router;
