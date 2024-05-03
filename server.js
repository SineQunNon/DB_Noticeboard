const express = require('express')
const mysql = require('mysql')
const app = express()
const PORT = 3000

app.use(express.json());

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

    const sql = 'test'

    db.query(sql, accountData, (err, result)=>{
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
    const { 아이디, 비밀빈호 } = req.body

    //db에서 아이디 비밀번호 검색
    db.query(
        'SELECT * FROM USER WHERE USER_ID = ? AND USER_PW = ?;',
        [아이디, 비밀번호],
        (err, rows)=>{
            if(err) {
                console.error('Error Executing query: ', err)
                res.status(501).json({success : false, message: '서버 오류'})
                return
            }
            if (rows.length > 0){
                let user_pk = rows[0].PK_ID

                res.json({user_pk})
            }else{
                res.josn({success:false, message:'아이디 및 비밀번호를 확인하세요.'})
            }
    })
})

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행중입니다.`)
})