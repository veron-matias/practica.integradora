const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://mgvCoderhouse:coderhouse@cluster0.dbexm8g.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("conectados"))
  .catch((err) => console.log(err));