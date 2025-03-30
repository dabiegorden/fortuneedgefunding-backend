const bcrypt = require("bcryptjs")
// Update the import to match how the User model is exported
const { User } = require("../models/user.model") // Changed from User.model
const Profile = require("../models/profile")
const { Op } = require("sequelize")
const sequelize = require("../config/database")

exports.register = async (req, res) => {
  // Start a transaction
  const transaction = await sequelize.transaction()

  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const newUser = await User.create(
      {
        username,
        email,
        password: hashedPassword,
      },
      { transaction },
    )

    // Process profile image if uploaded
    let avatarUrl = null
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`
    }

    // Create profile
    await Profile.create(
      {
        userId: newUser.id,
        avatarUrl,
        bio: "",
        fullName: "",
        location: "",
      },
      { transaction },
    )

    // Commit transaction
    await transaction.commit()

    // Create session
    req.session.userId = newUser.id
    req.session.username = newUser.username

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profile: {
          avatarUrl,
        },
      },
    })
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback()
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["avatarUrl", "bio", "fullName", "location"],
        },
      ],
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Create session
    req.session.userId = user.id
    req.session.username = user.username

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
}

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out, please try again" })
    }
    res.clearCookie("connect.sid") // Clear the session cookie
    res.json({ message: "Logged out successfully" })
  })
}

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const user = await User.findByPk(req.session.userId, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["avatarUrl", "bio", "fullName", "location"],
        },
      ],
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ message: "Server error retrieving user" })
  }
}

