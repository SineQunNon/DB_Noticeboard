const express = require('express')
const mysql = require('mysql')
const app = express()
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'ibdp',
    database : '20193061_Noticeboard'
})

db.getConnection((err, connection)=>{
    if(err){
        console.error('데이터베이스 연결 오류"',err)
        return
    }
    console.log("server.js Main File - DB OK")
    connection.release()
})

//회원가입 기능
app.post('/signup', (req, res)=>{
    const accountData = req.body
    console.log("서버 접속! 전달 받은 데이터 : ")
    console.log(accountData)

    const userData = [
        [accountData.user_name, accountData.user_id, accountData.user_pw, accountData.phone_number, accountData.address]
    ];

    const sql = 'INSERT INTO USER (user_name, user_id, user_pw, phone_number, address) VALUES ?'

    db.query(sql, [userData], (err, result)=>{
        if(err){
            console.error('회원가입에 실패했습니다: ', err.message)
            res.status(500).json({ success: false, message: '회원가입에 실패했습니다.' });
        }else{
            console.log('회원가입을 성공했습니다:', accountData);
            res.status(201).json({ success: true, message: '회원가입을 성공했습니다.' });
        }
    })
})

//로그인 기능
app.post('/login', (req, res)=>{
    console.log("로그인 요청 받음")
    console.log(req.body)
    const id = req.body.id
    const pw = req.body.pw
    //db에서 아이디 비밀번호 검색
    db.query(
        'SELECT * FROM USER WHERE USER_ID = ? AND USER_PW = ?;',
        [id, pw],
        (err, rows)=>{
            if(err) {
                console.error('Error Executing query: ', err)
                res.status(501).json({success : false, message: '서버 오류'})
                return
            }
            if (rows.length > 0){
                let pk_id = rows[0].pk_id
                console.log(rows[0])
                console.log(rows[0].pk_id)
                res.json({pk_id})
            }else{
                res.josn({success:false, message:'아이디 및 비밀번호를 확인하세요.'})
            }
    })
})

app.listen(3000, () => {
    console.log(`서버가 http://localhost:3000에서 실행중입니다.`);
});
