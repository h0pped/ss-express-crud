const express = require("express");
const mongoose = require("mongoose");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

console.log(process.env.PORT);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(options);
const app = express();

require("dotenv").config({ path: "./env/.env" });

const PORT = process.env.port || 8000;
const DB_URL = process.env.DB_URL;

const userRouter = require("./routes/user.js");

app.use(express.json());
app.use("/user", userRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get:
 *    description: Use to check if server responses
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/", (req, res) => {
  res.send({ msg: "Hello there!" });
});
app.listen(PORT, async () => {
  mongoose
    .connect(DB_URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("Listening on:", PORT);
});
