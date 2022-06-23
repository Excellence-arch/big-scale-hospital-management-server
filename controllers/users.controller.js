const UserModel = require("../models/users.model");
const { internalServerError } = require("./errors.controller");

const connectChat = (req, res) => {
  return 0;
};

const generateRandomNumber = () => {
  return Math.floor(Math.random + 10000);
};

const register = (req, res) => {
  const newUser = req.body;
  newUser.picture = "",
  newUser.verified = false;
  newUser.role = "user";
  let id = generateRandomNumber();
  UserModel.findOne({ id }, (error, result) => {
    if (error) {
      internalServerError(res);
    } else {
      if (result) {
        register(req);
      } else {
        UserModel.findOne({ email: req.body.email }, (err, response) => {
          if (err) {
            internalServerError(res)
          } else {
            if (response) {
              res.send({ status: false, message: "Email already exist" });
            } else {
              const form = new UserModel(newUser);
              form.save((errors, resp) => {
                if(errors) {
                  internalServerError(res)
                } else {
                  if(resp) {
                    res.send({status: true, message: "Registration successful"});
                  }
                }
              })
            }
          }
        });
      }
    }
  });
};

const login = (req, res) => {
  UserModel.findOne({id: req.body.id}, (err, result) => {
    if (err) {
      internalServerError(res);
    } else {
      if(!result) {
        res.send({status: false, message: "Invalid Id"})
      } else {
        if (result.verified === false) {
          res.send({status: false, message: "Account has not been Verified, please check your email and verify it. Thank you"});
        } else {
          res.send({status: true, message: "login successful"});
        }
      }
    }
  })
};

module.exports = { connectChat, register, login };
