const UserModel = require("../models/users.model");
const VerificationModel = require("../models/verification.model");
const { internalServerError } = require("./errors.controller");
const pool = require("../mysql_connection")

const generatePin = () => {
  return Math.floor(Math.random()*10000) + 90000;
}

const verifyCode = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) {
      internalServerError(res);
    } else {
      connection.query("SELECT * FROM verification WHERE ?", {id: req.body.id}, (error, response) => {
        if(error) {
          res.send({status: false, message: error.sqlMessage});
        } else {
          if (response[0].userId == req.body.userId) {
            pool.getConnection((error, con) => {
              if (error) internalServerError(res);
              else {
                  con.query(`UPDATE verification SET expired = 1 WHERE id = ${(response[0].id)}`, (err, resp) => {
                  if(err) {
                    res.send({status: false, message: err.sqlMessage})
                  } else {
                    // console.log(resp);
                    pool.getConnection((error, connect) => {
                      if (error) internalServerError(res);
                      else {
                        // console.log(connect);
                        connect.query(
                          `UPDATE users SET verified = 1 WHERE id = ${req.body.userId}`,
                          (err, resp) => {
                            if (err) {
                              res.send({
                                status: false,
                                message: err.sqlMessage,
                              });
                            } else {
                              res.send({
                                status: true,
                                message: "Verification successful",
                              });
                            }
                          }
                        );
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  })
  // VerificationModel.findOne({id: req.body.id}, (err, response) => {
  //   if (err) {
  //     internalServerError(res);
  //   } else {
  //     if(!response) {
  //       res.send({status: false, message: `Invalid verification code`});
  //     } else {
  //       UserModel.findOne({id: response.userId}, (error, result) => {
  //         if(error) {
  //           internalServerError(res);
  //         } else {
  //           if (!result) {
  //             console.log("Hi");
  //             res.send({ status: false, message: `Invalid verification code` });
  //           } else {
  //             result.verified = true;
  //             response.expired = true;
  //             UserModel.findByIdAndUpdate(result._id, result, (errors, resp) => {
  //               if(errors) {
  //                 internalServerError(res);
  //               } else {
  //                 VerificationModel.findByIdAndUpdate(response._id, response, (errorss, results) => {
  //                   if(errorss) {
  //                     internalServerError(res)
  //                   } else {
  //                     if(results) {
  //                       res.status(200).send({status: true, message: "verification successful", resp});
  //                     }
  //                   }
  //                 })
  //               }
  //             })
  //           }
  //         }
  //       })
  //     }
  //   }
  // })
}

module.exports = { generatePin, verifyCode }