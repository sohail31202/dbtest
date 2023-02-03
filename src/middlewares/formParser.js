
const formParser = async (req, res, next) => {
    const bodyParser = require("body-parser");
    const formParser = bodyParser.urlencoded({extended : false});

    next()
}

module.exports = formParser;