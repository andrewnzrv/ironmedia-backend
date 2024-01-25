const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const usersRouter = require("./users.routes");
router.use("/users", usersRouter);

module.exports = router;
