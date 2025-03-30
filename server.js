const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const path = require("path")
dotenv.config()
const authRoutes = require("./routes/authRoutes")

const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session)
const sequelize = require("./config/database")

// Add this near the top of your server.js file
const { User, Profile } = require("./models/index")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res) => {
  res.send("Hello World")
})

// MySQL session store options
const sessionStoreOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}

// Create MySQL session store
const sessionStore = new MySQLStore(sessionStoreOptions)

// CORS configuration - Update to allow credentials
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Your frontend URL
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// Middleware
app.use(cors(corsOptions))

// Session middleware
app.use(
  session({
    key: "session_cookie_name",
    secret: process.env.SESSION_SECRET || "your-secret-key", // Fallback for development
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Important for cross-site requests
    },
  }),
)

// Routes
app.use("/api/auth", authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!", error: err.message })
})

// Make sure the uploads directory exists
const fs = require("fs")
const uploadDir = path.join(__dirname, "uploads/avatars")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`)
})

