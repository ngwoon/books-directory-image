const express = require('express');
const fs = require('fs');
const connection = require("../dbconn.js");

const router = express.Router();
const FILE_PATH = "/../public/files/"
const TABLE = "message";
let fileList = [];

function init() {
    const files = fs.readdir(__dirname + FILE_PATH, function(error, files) {
        if(error) {
            // 디렉토리 파일 읽어오기 에러 처리 -> 500에러
        }
        files.forEach(file => {
            const splited = file.split(".");
            fileList.push(splited[0]);
        });
    });

    router.get('', function(req, res, next) {
        const searchTerm = req.query['searchTerm'];
        const coincideFiles = [];
        fileList.forEach(file => {
            for(let i=0; i<searchTerm.length; ++i) {
                if(file.indexOf(searchTerm[i]) !== -1) {
                    coincideFiles.push(file);
                    break;
                }
            }
        });

        res.render("search_result", { files: coincideFiles });
    });

    router.get('/document', function(req, res, next) {

        const title = req.query['file'];
        const fileName = title + ".txt";
        const path = FILE_PATH + fileName;
        console.log(title);

        fs.readFile(__dirname + path, function(error, content) {
            if(error) {
                console.log("-- File Read Error --");
                console.log(error);
                res.render("404");
            } else {
                res.render("show_file", {
                    title, 
                    content,
                    user: req.session.user
                });
            }
        });
    });

    router.put("/document", function(req, res, next) {
        const content = req.body.content;
        const title = req.body.title;
        const fileName = title + ".txt";
        const path = FILE_PATH + fileName;

        console.log(`title = ${title}`);

        fs.writeFile(__dirname + path, content, function(error) {
            if(error) {
                console.log("-- File Write Error --");
                console.log(error);
                res.send("File Write Error");
            } else {
                const path = '/documents/document?file='+title;
                res.redirect(302, path);
            }
        });
    });

    router.delete("/document", async function(req, res, next) {

        const querying = async () => {
            const result = {state: "success"};
            let conn;
            try {
                conn = await connection.getConnection(async c => c);
                try {
                    const title = req.body.title;
                    const user = req.session.user;
                    const mtype = "delete";
                    const sql = "INSERT INTO " + TABLE + " (mtype, title, reason, user) VALUES(?,?,?,?)";
                    await conn.query(sql, [mtype, title, "default", user]);
                } catch(error) {
                    console.log("document 삭제 요청 INSERT 구문 에러");
                    console.log(error);
                    result.state = "fail";
                }
            } catch(error) {
                console.log("document DB 연결 에러");
                console.log(error);
                result.state = "fail";
            } finally {
                conn.release();
                return result;
            }
        }

        const result = await querying();

        res.json(result);
    });
}

init();
module.exports = router;
    