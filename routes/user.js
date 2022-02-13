const express = require("express");
// let users = require("../data/users.js");

const router = express.Router();

// Middlewares
const checkEmail = require("../middlewares/checkEmail.js");
// Util
// const findIndexByID = require("../util/findIndexByID.js");

// Models
const User = require("../models/user");

/**
 * @swagger
 * components:
 *  schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: First name of the user
 *         surname:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           description: email of the user
 *       example:
 *         _id: "112312sdfksdf"
 *         name: John
 *         surname: Doe
 *         email: notawril@gmail.com
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users managing API
 *
 */

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Returns a list of users
 *    tags: [Users]
 *    description: Get list of users
 *    responses:
 *      '200':
 *        description: List of users
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#components/schemas/User'
 *      '500':
 *        description: Internal server error
 *
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    summary: Returns a User
 *    tags: [Users]
 *    description: Get User by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: User object
 *        contens:
 *          application/json:
 *           schema:
 *              items:
 *                $ref: '#components/schemas/User'
 *      '500':
 *        description: Internal server error
 *      '404':
 *        description: User not found
 *
 */
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

/**
 * @swagger
 * /user/:
 *  post:
 *    summary: Adds user to DB
 *    tags: [Users]
 *    description: Create new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '201':
 *        description: The User was succesfully created
 *        contens:
 *          application/json:
 *           schema:
 *                $ref: '#components/schemas/User'
 *      '500':
 *        description: Internal server error
 *      '400':
 *        description: User already exists
 *
 */
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

/**
 * @swagger
 * /user/:
 *  patch:
 *    summary: Edits user
 *    tags: [Users]
 *    description: Edit user in DB
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: The User was succesfully updated
 *        content:
 *          application/json:
 *           schema:
 *                $ref: '#components/schemas/User'
 *      '500':
 *        description: Internal server error
 *      '404':
 *        description: User was not found
 *
 */
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

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *    summary: Removes user from DB
 *    tags: [Users]
 *    description: remove user from DB
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: User Deleted
 *        contens:
 *          application/json:
 *           schema:
 *              items:
 *                $ref: '#components/schemas/User'
 *      '500':
 *        description: Internal server error
 *      '404':
 *        description: User not found
 *
 */
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
