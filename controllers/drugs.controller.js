const pool = require("../mysql_connection")
const { internalServerError } = require("./errors.controller")

const add_drugs = (req, res) => {
    const new_drug = req.body;
    pool.getConnection((err, con) => {
        if(err) {
            internalServerError(res);
        }else {
            con.query("INSERT INTO drugs SET ?", new_drug, (err, resp) => {
                if(err) {
                    res.send({status: false, message: err.sqlMessage});
                } else {
                    if(resp.affectedRows !== 0) {
                        res.send({status: true, message: `${new_drug.name} added successfully`});
                    }
                }
            })
        }
    })
}