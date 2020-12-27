const mysql = require('mysql2/promise');
const os = require("os");
const secret = require('./secrets.json');

let HOST = secret.DEVELOP_HOST; 
let ID = secret.DEVELOP_ID;
let PW = secret.DEVELOP_PW; 
let SERVER = secret.DEVELOP_SERVER;
let DB = secret.DB;
let connection;

function setInfoVariables() {
    if(os.hostname() !== secret.HOSTNAME) {
        HOST = secret.DEPLOY_HOST;
        ID = secret.DEPLOY_ID;
        PW = secret.DEPLOY_PW;
        SERVER = secret.DEPLOY_SERVER;
    }
}

/*
    DB connection
*/
function connectDB() {
    connection = mysql.createPool({
        host            : HOST,
        user            : ID,
        password        : PW,
        database        : DB,
        port            : "3306",
        charset         : "utf8",
    });
}

function init() {
    setInfoVariables();
    connectDB();
}

init();
module.exports = connection;