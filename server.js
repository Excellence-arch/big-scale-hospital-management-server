const express = require("express");
const app = express();
require("dotenv").config();
// const mongoose = require("mongoose");
// const mysql = require("mysql");
// const db_connection = require("./mysql_connection");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users.route");
const adminRouter = require("./routes/admin.route");
const pool = require("./mysql_connection");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use("/users", userRouter);
app.use("/admin", adminRouter);


const PORT = process.env.PORT || 5000;
const URI = process.env.URI;


// mongoose.connect(URI, (err) => {
//   if (err) {
//     console.log("Error connecting to the database");
//   } else {
//     console.log("Connection to the database established");
//   }
// })

const connection = app.listen(PORT, () => console.log(`app is listening on port: ${PORT}`));

pool.getConnection((err, con) => {
  if(err) {
    console.log("Error connecting to the database");
  } else {
    console.log("Connection to the database established")
  }
})

const io = require("socket.io")(connection, {cors: {options: "*"}});


io.on("connection", (socket) => {
  console.log(`${socket.id} is online`);
  socket.on("new-chat", (newMessage) => {
    io.emit("receive-message", newMessage);
  })
  socket.on("disconnect", () => {
    console.log(`${socket.id} is offline`);
  })
});