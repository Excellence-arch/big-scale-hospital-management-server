const internalServerError = (res) => {
  res.status(501).send({status: false, message: "Internal Server Srror"});
}
module.exports = {internalServerError}