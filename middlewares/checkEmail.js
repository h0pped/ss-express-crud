// const express =require('express')
// const users = require("../data/users");

const User = require("../models/user");

module.exports = async function checkEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).send({ err: "User with such email already exists" });
  } else {
    return next();
  }
};
