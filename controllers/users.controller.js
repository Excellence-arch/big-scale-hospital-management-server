const UserModel = require("../models/users.model");
const { internalServerError } = require("./errors.controller");
const nodemailer = require("nodemailer");
const VerificationModel = require("../models/verification.model");
const { generatePin } = require("./verification.controller");

const connectChat = (req, res) => {
  return 0;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const generateRandomNumber = () => {
  let x = Math.floor(Math.random() * 10000);
  // console.log(Math.random)
  return x;
};

const register = (req, res) => {
  const newUser = req.body;
  (newUser.picture = ""), (newUser.verified = false);
  newUser.role = "patient";
  newUser.fired = false;
  newUser.id = generateRandomNumber();
  UserModel.findOne({ id: newUser.id }, (error, result) => {
    if (error) {
      // console.log(error);
      internalServerError(res);
    } else {
      if (result) {
        register(req, res);
      } else {
        UserModel.findOne({ email: req.body.email }, (err, response) => {
          if (err) {
            internalServerError(res);
          } else {
            if (response) {
              res.send({ status: false, message: "Email already exist" });
            } else {
              const form = new UserModel(newUser);
              form.save((errors, resp) => {
                if (errors) {
                  internalServerError(res);
                } else {
                  if (resp) {
                    const verify = {
                      id: generatePin(),
                      userId: resp.id,
                      for: "registration",
                      expired: false,
                    };
                    const newForm = new VerificationModel(verify);
                    newForm.save((errors, results) => {
                      if (errors) {
                        console.log(errors)
                        res.send({
                          status: false,
                          message: `Error generating verification pin, Please contact ${process.env.EMAIL} to resolve this issue. Thank you`,
                        });
                      } else {
                        if (results) {
                          const mailOptions = {
                            from: process.env.EMAIL, // sender address
                            to: resp.email, // list of receivers
                            subject: "Hospital Management: Email Verification", // Subject line
                            html: `<h1>Welcome to this hospital</h1> <br /> <p>We will give you the utmost care and support</p> <p>Your login ID is ${resp.id}</p> <p>Verification ID: ${results.id}</p>`, // plain text body
                          };
                          transporter.sendMail(
                            mailOptions,
                            function (errorss, info) {
                              if (errorss) {
                                internalServerError(res);
                              } else {
                                res.send({
                                  status: true,
                                  message: `A message has been sent to your ${info.envelope.to[0]}. Please verify your account`,
                                });
                              }
                            }
                          );
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
};

const login = (req, res) => {
  UserModel.findOne({ id: req.body.id }, (err, result) => {
    if (err) {
      internalServerError(res);
    } else {
      if (!result) {
        res.send({ status: false, message: "Invalid Id" });
      } else {
        if (result.verified === false) {
          res.send({
            status: true,
            message:
              "Account has not been Verified, please check your email and verify it. Thank you",
            verified: false
          });
        } else {
          res.send({ status: true, message: "login successful", verified: false });
        }
      }
    }
  });
};

module.exports = { connectChat, register, login };
