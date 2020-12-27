const express = require('express');
const os = require("os");
const connection = require("../dbconn.js");
const secret = require("../secrets.json");
const router = express.Router();

const TABLE = "user";
// let SERVER = secret.SERVER;

function init() {

    // if(os.hostname === secret.HOSTNAME)
    //     SERVER = secret.DEVELOP_SERVER;
    // else
    //     SERVER = secret.DEPLOY_SERVER;

    router.get('', function(req, res, next) {
        res.render('signup');
    });

    router.post('', async function(req, res, next) {
        const id = req.body.username;
        const pw = req.body.pass;
        const type = "normal";
        
        console.log(id, pw);

        const querying = async () => {
            let result = {};
            let conn;

            result.type = true;
            
            try {
                conn = await connection.getConnection(async c => c);
                try {
                    let sql = "SELECT * FROM " + TABLE + " WHERE id = ?";
                    const dupCheckQueryResult = await conn.query(sql, [id]);
                    
                    // 중복되는 아이디가 없을 때
                    if(dupCheckQueryResult[0].length === 0) {
                        try {
                            sql = "INSERT INTO " + TABLE + "(id, password, type) VALUES(?,?,?)";
                            const insertQueryResult = await conn.query(sql, [id, pw, type]);
                        } catch(error) {
                            console.log("회원가입 INSERT 구문 오류");
                            console.log(error);
                            result.type = false;
                            result.reason = "server db error";
                        }
                    } else {
                        result.type = false;
                        result.reason = "id exists";
                    }
                } catch(error) {
                    console.log("회원가입 SELECT 구문 오류");
                    console.log(error);
                    result.type = false;
                    result.reason = "server db error";
                }
            } catch(error) {
                console.log("데이터베이스 연결 오류");
                console.log(error);
                result.type = false;
                result.reason = "server db error";
            } finally {
                conn.release();
                return result;
            }
        }

        const result = await querying();

        if(!result.type) {
            res.json({
                state: "fail",
                reason: result.reason,
            });
        } else {
            req.session.user = id;
            res.json({
                state: "success",
                href: "/",
            });
        }
    });
}


init();
module.exports = router;
