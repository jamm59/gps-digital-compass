const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
// App setup
const PORT = 3000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port: ${PORT}`);
});

app.use(cors());
app.use(express.static("public"));
