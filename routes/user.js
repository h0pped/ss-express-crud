const express = require("express");
// let users = require("../data/users.js");

const router = express.Router();

// Middlewares
const checkEmail = require("../middlewares/checkEmail.js");
// const checkID = require("../middlewares/checkID.js");

// Util
// const findIndexByID = require("../util/findIndexByID.js");

// Models
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    user ? res.send(user) : res.status(404).send({ err: "User not found" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

router.post("/", checkEmail, async (req, res) => {
  const { name, surname, email } = req.body;
  const user = new User({
    email,
    name,
    surname,
  });
  try {
    await user.save();
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});
router.patch("/", async (req, res) => {
  const { _id, name, surname, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id, {
      name,
      surname,
      email,
    });
    if (user) {
      return res.send({ msg: "OK" });
    } else {
      return res.status(404).send({ err: "User with such ID was not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (user) {
    return res.status(200).send({ msg: "OK" });
  } else {
    return res.status(404).send({ err: "User with such ID was not found" });
  }
});

//curl -d '{"id":"10","name":"Illia","surname":"Nykonchuk","email":"johnd@gmail.com"}' -H "Content-Type: application/json" -X POST http://localhost:80/user

//curl -H "Content-Type: application/json" -X DELETE http://localhost:80/user/2

//curl -d '{"name":"Bob", "surname":"Ross","email":"bobross4@gmail.com"}' -H "Content-Type: application/json" -X PATCH http://localhost:80/user/4

module.exports = router;
