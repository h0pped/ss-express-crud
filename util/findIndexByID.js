const users = require("../data/users");
module.exports = (id) => {
  return users.findIndex((user) => user.id === id);
};
