const UserModel = require("../models/users.model");
const { internalServerError } = require("./errors.controller");
const nodemailer = require("nodemailer");
const VerificationModel = require("../models/verification.model");
const { generatePin } = require("./verification.controller");
// const connection = require("../mysql_connection");

const mysql = require("mysql");
// const XOAuth2 = require("nodemailer/lib/xoauth2");

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "hospital_management",
});

const connectChat = (req, res) => {
  return 0;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // service: "gmail",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    // pass: process.env.PASSWORD,
    serviceClient: process.env.client_id,
    privateKey: process.env.private_key,
  },
});

// transporter.set("oauth2_provision_cb", (user, renew, callback) => {
//   let accessToken = userTokens[user];
//   if (!accessToken) {
//     return callback(new Error("Unknown user"));
//   } else {
//     return callback(null, accessToken);
//   }
// });

const generateRandomNumber = () => {
  let x = Math.floor(Math.random() * 10000);
  // console.log(Math.random)
  return x;
};

const register = (req, res) => {
  const newUser = req.body;
  newUser.picture = "";
  newUser.verified = false;
  newUser.role = "patient";
  newUser.fired = false;
  newUser.id = generateRandomNumber();

  pool.getConnection((err, connection) => {
    if(err) {
      // console.log(err)
      internalServerError(res)
    } else {
      connection.query("INSERT INTO users SET ?", newUser, (err, resp) => {
        if(err) {
          res.send({status: false, message: err.sqlMessage})
        } else {
          if(resp.affectedRows !== 0) {
            const verify = {
            id: generatePin(),
            userId: newUser.id,
            for: "registration",
            expired: false,
          };
          connection.query("INSERT INTO verification SET ?", verify, (error, response) => {
            if(error) {
              res.send({status: false, message: "An error occurred while generating your verification pin, please contact oladipupomichael9@gmail.com to verify your account. Thank you"});
            } else {
              console.log(newUser, verify);
              const mailOptions = {
            from: process.env.EMAIL, // sender address
            to: newUser.email, // list of receivers
            subject: "Hospital Management: Email Verification", // Subject line
            // text: "Hi",
            html: `<h1>Welcome to this hospital</h1> <br /> <p>We will give you the utmost care and support</p> <p>Your login ID is ${newUser.id}</p> <p>Verification ID: ${verify.id}</p>`, // plain text body
          };
          transporter.sendMail(
            mailOptions,
            function (errorss, info) {
              if (errorss) {
                console.log(errorss)
                internalServerError(res);
              } else {
                res.send({
                  status: true,
                  message: `A message has been sent to your ${info.envelope.to[0]}. Please verify your account`,
                });
              }
            })
            }
          })
          
          } else {
            res.send({status: false, message: ""})
          }
        }
      })
    }
  })

  // UserModel.findOne({ id: newUser.id }, (error, result) => {
  //   if (error) {
  //     // console.log(error);
  //     internalServerError(res);
  //   } else {
  //   if (result) {
  //     register(req, res);
  //   } else {
  //     UserModel.findOne({ email: req.body.email }, (err, response) => {
  //       if (err) {
  //         internalServerError(res);
  //       } else {
  //         if (response) {
  //           res.send({ status: false, message: "Email already exist" });
  //         } else {
  //           const form = new UserModel(newUser);
  //           form.save((errors, resp) => {
  //             if (errors) {
  //               internalServerError(res);
  //             } else {
  //               if (resp) {
  //                 const verify = {
  //                   id: generatePin(),
  //                   userId: resp.id,
  //                   for: "registration",
  //                   expired: false,
  //                 };
  //                 const newForm = new VerificationModel(verify);
  //                 newForm.save((errors, results) => {
  //                   if (errors) {
  //                     console.log(errors)
  //                     res.send({
  //                       status: false,
  //                       message: `Error generating verification pin, Please contact ${process.env.EMAIL} to resolve this issue. Thank you`,
  //                     });
  //                   } else {
  //                     if (results) {
  //                       const mailOptions = {
  //                         from: process.env.EMAIL, // sender address
  //                         to: resp.email, // list of receivers
  //                         subject: "Hospital Management: Email Verification", // Subject line
  //                         html: `<h1>Welcome to this hospital</h1> <br /> <p>We will give you the utmost care and support</p> <p>Your login ID is ${resp.id}</p> <p>Verification ID: ${results.id}</p>`, // plain text body
  //                       };
  //                       transporter.sendMail(
  //                         mailOptions,
  //                         function (errorss, info) {
  //                           if (errorss) {
  //                             internalServerError(res);
  //                           } else {
  //                             res.send({
  //                               status: true,
  //                               message: `A message has been sent to your ${info.envelope.to[0]}. Please verify your account`,
  //                             });
  //                           }
  //                         }
  //                       );
  //                     }
  //                   }
  //                 });
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }
  // }
  // });
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
            verified: false,
          });
        } else {
          res.send({
            status: true,
            message: "login successful",
            verified: false,
          });
        }
      }
    }
  });
};

module.exports = { connectChat, register, login };
