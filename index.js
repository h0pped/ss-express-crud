const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config({ path: "./env/dev.env" });

const userRouter = require("./routes/user.js");

app.use(express.json());
app.use("/user", userRouter);

const PORT = process.env.port || 80;
const DB_URL = process.env.DB_URL;
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
