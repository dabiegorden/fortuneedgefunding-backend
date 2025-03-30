const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const { User } = require("./user.model")

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      unique: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "profiles",
    timestamps: true,
  },
)

// Define the association with User
Profile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
})

module.exports = Profile

