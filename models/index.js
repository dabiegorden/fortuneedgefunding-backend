const { User, setupAssociations } = require("./user.model")
const Profile = require("./profile")

// Setup associations between models
setupAssociations()

module.exports = {
  User,
  Profile,
}

