const UserModel = require("../models/users.model");
const VerificationModel = require("../models/verification.model");
const { internalServerError } = require("./errors.controller");

const generatePin = () => {
  return Math.floor(Math.random()*10000) + 90000;
}

const verifyCode = (req, res) => {
  VerificationModel.findOne({id: req.body.id}, (err, response) => {
    if (err) {
      internalServerError(res);
    } else {
      if(!response) {
        res.send({status: false, message: `Invalid verification code`});
      } else {
        UserModel.findOne({id: req.body.userId}, (error, result) => {
          if(error) {
            internalServerError(res);
          } else {
            if (!result) {
              res.send({ status: false, message: `Invalid verification code` });
            } else {
        //       UserModel.findOne({id: response.userId}, (errorss, results) => {
        //         if (errorss) {
        //           internalServerError(res);
        //         } else {
        //           if(!resultss) {
        //             res.send({status: false, message: `An unknown error occurred`});
        //           } else {
        //             response.expired = true;
        //             VerificationModel.findByIdAndUpdate(
        //               response._id,
        //               response,
        //               (errors, resp) => {
        //                 if (errors) {
        //                   internalServerError(res);
        //                 } else {
        //                   if (resp) {
        //                     res
        //                       .status(200)
        //                       .send({
        //                         status: true,
        //                         message: `successful`,
        //                         result,
        //                       });
        //                   } else {
        //                     res.send({
        //                       status: false,
        //                       message: "An unknown error occurred",
        //                     });
        //                   }
        //                 }
        //               }
        //             );
        //           }
        //         }
        //       })
            }
          }
        })
      }
    }
  })
}

module.exports = { generatePin, verifyCode }