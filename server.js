const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv.config();
const authRoutes = require("./routes/authRoutes");

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sequelize = require('./config/database');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.send("Hello World");
});

// MySQL session store options
const sessionStoreOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
  
  // Create MySQL session store
  const sessionStore = new MySQLStore(sessionStoreOptions);

  // CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Your frontend URL
    credentials: true,
    optionsSuccessStatus: 200,
    credentials: true,
  };
  
  // Middleware
  app.use(cors(corsOptions));

  // Session middleware
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  }));

  // Routes
app.use('/api/auth', authRoutes);

// Database connection
// sequelize.sync()
//   .then(() => console.log('Database connected'))
//   .catch(err => console.error('Database connection error:', err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});