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

app.listen(3000, () => {
    console.log(`서버가 http://localhost:3000에서 실행중입니다.`);
});

/*--------------------------------- 회원 가입 ---------------------------------*/
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






/*--------------------------------- 로그인 ---------------------------------*/
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








/*--------------------------------- 게시글 작성 ---------------------------------*/
app.post('/writepost', (req, res) =>{
    console.log("게시글 작성 into")
    console.log(req.body)
    const pk_id = parseInt(req.body.pk_id)
    const postData = [
        [pk_id, req.body.title, req.body.post_detail]
    ]
    const sql = "INSERT INTO POST (pk_id, title, post_detail) VALUES ?"

    db.query(sql, [postData], (err)=>{
        if(err){
            console.error('게시글 작성 실패', err.message)
            res.status(500).json({ success: false, message: '게시글 작성에 실패했습니다.' });
        }else{
            console.log('게시글 작성 성공:', postData);
            res.status(201).json({ success: true, message: '게시글 작성 성공했습니다.' });
        }
    })
})




/*--------------------------------- 게시글 삭제 ---------------------------------*/
app.post('/deletepost', (req, res)=>{
    console.log("게시 글 삭제 into")
    console.log(req.body)
    const post_id = parseInt(req.body.post_id)
    const sql = "DELETE FROM post WHERE post_id = ?"

    db.query(sql, post_id, (err) => {
        if(err){
            console.error('게시글 삭제 실패', err.message)
            res.status(500).json({ success: false, message: '게시글 삭제를 실패했습니다.' });
        }else{
            console.log('게시글 삭제 성공:', post_id);
            res.status(201).json({ success: true, message: '게시글 삭제를 성공했습니다.' });
        }
    })
})





/*--------------------------------- 댓글 작성 ---------------------------------*/
app.post('/writecomment', (req, res) => {
    console.log("댓글 작성 into")
    console.log(req.body)
    const post_id = parseInt(req.body.post_id)
    const pk_id = parseInt(req.body.pk_id)
    
    const commentData = [
        [post_id ,pk_id, req.body.comment_detail]
    ]
    console.log(commentData)
    const sql = "INSERT INTO COMMENTS (post_id, pk_id, comment_detail) VALUES ?"

    db.query(sql, [commentData], (err) =>{
        if(err){
            console.error('댓글 작성 실패', err.message)
            res.status(500).json({ success: false, message: '댓글 작성을 실패했습니다.' });
        }else{
            console.log('댓글 작성 성공:', post_id);
            res.status(201).json({ success: true, message: '댓글 작성을 성공했습니다.' });
        }
    })
})




/*--------------------------------- 댓글 삭제 ---------------------------------*/
app.post('/deletecomment', (req, res)=>{
    console.log("댓글 삭제 into")
    console.log(req.body)
    const comment_id = parseInt(req.body.comment_id)

    
    const sql = "DELETE FROM comments WHERE comment_id = ?"

    db.query(sql, [comment_id], (err) => {
        if(err){
            console.error('댓글 삭제 실패', err.message)
            res.status(500).json({ success: false, message: '댓글 삭제를 실패했습니다.' });
        }else{
            console.log('댓글 삭제 성공:', comment_id);
            res.status(201).json({ success: true, message: '댓글 삭제를 성공했습니다.' });
        }
    })
})








/*--------------------------------- 전체 글 조회 ---------------------------------*/
//전체 글 조회(n개 단위 조회/페이징)
//내용/댓글 제외한 모든 내용을 리스트로 확인
app.get('/pagelist', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // 시작 인덱스 계산
    const startIndex = (page - 1) * pageSize;

    // SQL 쿼리문 작성
    const sql = 'SELECT title FROM POST LIMIT ?, ?';

    // 쿼리 실행
    db.query(sql, [startIndex, pageSize], (err, rows) => {
        if (err) {
            console.error("글 조회 실패:", err);
            res.status(501).json({ success: false, message: '서버 오류' });
            return;
        }
        if (rows.length > 0) {
            res.json({ rows });
        } else {
            res.json({ success: false, message: '더 이상 글이 없습니다.' });
        }
    });
});







/*--------------------------------- 게시 글 상세 조회 ---------------------------------*/
app.get('/pageinfo', (req, res) => {
    console.log("게시 글 상제 조회 into")

    const post_id = parseInt(req.body.post_id)
    const sql = 'SELECT *\
                FROM post, comments, user\
                WHERE post.post_id = comments.post_id AND post.pk_id = user.pk_id\
                AND post.post_id = ?'
    db.query(sql, [post_id], (err, rows) => {
        if(err){
            console.error("상세 글 조회 실패 : ", err)
            res.status(501).json({ success: false, message: '서버 오류' })
            return
        }
        if (rows.length > 0) {
            console.log(rows)
            res.json({ rows });
        }
    })
})

