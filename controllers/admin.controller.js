const UserModel = require("../models/users.model")
const { internalServerError } = require("./errors.controller")

const getDashboard = (req, res) => {
  UserModel.find((err, response) => {
    if(err) {
      internalServerError(res);
    } else {
      if (response) {
        res.send({status: true, message: "Data found", response});
      }
    }
  })
}

const changeRole = (req, res) => {
  const user = req.body;
  UserModel.findByIdAndUpdate(req.body._id, user, (err, response) => {
    if(err) {
      internalServerError(res);
    } else {
      if (!response) {
        res.send({status: false, message: `Could not change ${user.first_name}'s role`});
      } else {
        if(response && !response.fired) res.status(200).send({status: true, message: `${user.first_name} is now a ${user.role}`});
      }
    }
  })
}

module.exports = { getDashboard, changeRole }