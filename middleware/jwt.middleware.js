const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    if (req.headers.authorization?.split(" ")[0] === "Bearer") {
      const token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);

      req.tokenPayload = payload; // { userId }
      next();
    } else {
      throw new Error("No token");
    }
  } catch (error) {
    res.status(401).json("Token is not provided or not valid");
  }
};

const multer = require("multer");
const path = require("path");

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Create the Multer middleware
const upload = multer({ storage: storage });

module.exports = { isAuthenticated, upload };
