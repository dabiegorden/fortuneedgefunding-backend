const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const authController = require("../controllers/authController")

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Update the multer configuration to handle errors
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false)
    }
    cb(null, true)
  },
}).single("profileImage")

// Update the register route to handle multer errors
router.post("/register", (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: `Unknown error: ${err.message}` })
    }
    // Everything went fine, proceed to controller
    authController.register(req, res, next)
  })
})

// Add the login route
router.post("/login", authController.login)

// Add the logout route
router.post("/logout", authController.logout)

// Add the getCurrentUser route
router.get("/getCurrentUser", authController.getCurrentUser)

module.exports = router

