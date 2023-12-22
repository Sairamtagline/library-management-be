const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE_URL, {})
  .then((conn) => {
    console.log("Connected to DB");
  })
  .catch((error) => console.log("error :>> ", error));
