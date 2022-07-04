const UserModel = require("../models/users.model");
const { internalServerError } = require("./errors.controller");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { generatePin } = require("./verification.controller");
const pool = require("../mysql_connection");

const connectChat = (req, res) => {
  return 0;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.passwords,
  },
  authMethod: "PLAIN",
  tls: {
    rejectUnauthorized: false,
  }
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
                res.send({status: false, message: `An error occured while trying to send a message to ${newUser.email}, your account has been registered but please contact ${process.env.EMAIL} to verify your account. Thank you`})
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
};

const login = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) {
      internalServerError(res)
    } else {
      connection.query(`SELECT * FROM users WHERE ?`, req.body, (error, response) => {
        if (error) res.send({ status: false, message: error.sqlMessage });
        else {
          if (response.length == 0) {
            res.send({status: false, message: "Invalid ID"});
          } else {
            if(response[0].verified == 0) {
              res.send({status: false, message: `Your account has not been verified, please check your email or contact ${process.env.email} to verify your account`, verified: false});
            } else {
              const token = jwt.sign({id: req.body.id}, "secret", {expiresIn: "1d"});
              res.send({status: true, message: "Success", verified: true, token});
            }
          }
        }
      })
    }
  })
};

const getDashboard = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "secret", (err, resp) => {
    if (err) {
      res.send({status: false, message: "Unauthorized"});
    } else {
      if (resp) {
        pool.getConnection((err, con) => {
          if (err) {
            internalServerError(res);
          }else {
            con.query(`SELECT * FROM users WHERE id=${resp.id}`, (error, response) => {
              if (error) {
                res.send({status: false, message: error.sqlMessage});
              } else {
                res.send({status: true, message: "Success", response});
              }
            })
          }
        })
      }
    }
  })
}

module.exports = { connectChat, register, login, getDashboard };
