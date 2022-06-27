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
        UserModel.findOne({id: response.userId}, (error, result) => {
          if(error) {
            internalServerError(res);
          } else {
            if (!result) {
              console.log("Hi");
              res.send({ status: false, message: `Invalid verification code` });
            } else {
              result.verified = true;
              response.expired = true;
              UserModel.findByIdAndUpdate(result._id, result, (errors, resp) => {
                if(errors) {
                  internalServerError(res);
                } else {
                  VerificationModel.findByIdAndUpdate(response._id, response, (errorss, results) => {
                    if(errorss) {
                      internalServerError(res)
                    } else {
                      if(results) {
                        res.status(200).send({status: true, message: "verification successful", resp});
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
  })
}

module.exports = { generatePin, verifyCode }