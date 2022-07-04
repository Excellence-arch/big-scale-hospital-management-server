const pool = require("../mysql_connection")
const { internalServerError } = require("./errors.controller")

const saveChat = (req, res) => {
  pool.getConnection((err, con) => {
    if(err) internalServerError(res);
    else {
      con.query("INSERT INTO chat SET ?", req.body, (err, response) => {
        if (err) res.send({status: false, message: err.sqlMessage});
        else {
          if (response.affectedRows !== 0) {
            res.send({status: true, message: "successful", chats: req.body});
          } else {
            res.send({status: false, message: "An error occurred"});
          }
        }
      })
    }
  })
}

const getAllChats = (req, res) => {
  pool.getConnection((err, con) => {
    if (err) internalServerError(res)
    else {
      con.query("SELECT * FROM chat", (error, resp) => {
        if (error) res.send({status: false, message: error.sqlMessage})
        else {
          res.send({status: true, message: "Success", resp})
        }
      });
    }
  });
};

module.exports = { saveChat, getAllChats }