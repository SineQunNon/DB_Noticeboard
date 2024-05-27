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
    database : '20193061_noticeboard'
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

    db.query(sql, [userData], (err)=>{
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
            // if(err) {
            //     console.error('Error Executing query: ', err)
            //     res.status(501).json({success : false, message: '서버 오류'})
            //     return
            // }

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
    const pk_id = parseInt(req.body.pk_id)
    
    const sql = "DELETE FROM comments WHERE comment_id = ? and pk_id = ?"

    db.query(sql, [comment_id, pk_id], (err) => {
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
    const sql = 'SELECT p.post_id, p.title, p.like_num, p.post_date, u.user_name \
                FROM POST AS p JOIN user AS u ON p.pk_id=u.pk_id \
                LIMIT ?, ?';

    // 쿼리 실행
    db.query(sql, [startIndex, pageSize], (err, rows) => {
        if (err) {
            console.error("글 조회 실패:", err);
            res.status(501).json({ success: false, message: '서버 오류' });
            return;
        }
        if (rows.length > 0) {
            res.json({ rows });
            console.log(rows)
        } else {
            res.json({ success: false, message: '더 이상 글이 없습니다.' });
        }
    });
});







/*--------------------------------- 게시 글 상세 조회 ---------------------------------*/
app.get('/pageinfo', (req, res) => {
    console.log("게시 글 상세 조회 into : ", req.query)

    const post_id = parseInt(req.query.post_id)

    const sql = 'SELECT *\
                FROM post AS p\
                JOIN user AS u ON p.pk_id = u.pk_id\
                WHERE p.post_id = ?'

    db.query(sql, [post_id], (err, rows) => {
        if(err){
            console.error("상세 글 조회 실패 : ", err)
            res.status(501).json({ success: false, message: '서버 오류' })
            return
        }
        if (rows.length > 0) {
            console.log(rows)
            res.json({rows});
        }else{
            console.log("데이터를 찾지 못함")
        }
    })
})


app.get('/commentslist', (req, res) => {
    console.log("댓글 상세 조회 into : ", req.query)

    const post_id = parseInt(req.query.post_id)

    const sql = 'SELECT *\
                FROM comments AS c\
                JOIN user AS u on u.pk_id = c.pk_id\
                WHERE post_id = ?'

    db.query(sql, [post_id], (err, rows) => {
        if(err){
            console.error("댓글 조회 실패 : ", err)
            res.status(501).json({ success: false, message: '서버 오류' })
            return
        }
        if (rows.length > 0) {
            console.log(rows)
            res.json({rows});
        }else{
            console.log("데이터를 찾지 못함")
        }
    })
})



/*--------------------------------- 좋아요 ---------------------------------*/
app.post('/updateLike', (req, res) => {
    const post_id = parseInt(req.body.post_id);
    const pk_id = parseInt(req.body.pk_id);

    const sql = 'SELECT * FROM is_like WHERE post_id = ? AND pk_id = ?';

    db.query(sql, [post_id, pk_id], (err, rows) => {
        if (err) {
            console.error("좋아요 업데이트 실패 : ", err);
            res.status(501).json({ success: false, message: '서버 오류' });
            return;
        }

        if (rows.length > 0) { // 좋아요 존재함 -> 좋아요 삭제
            const sql2 = 'DELETE FROM is_like WHERE post_id = ? AND pk_id = ?';

            db.query(sql2, [post_id, pk_id], (err, result) => {
                if (err) {
                    console.error("좋아요 삭제 실패 : ", err);
                    res.status(501).json({ success: false, message: '서버 오류' });
                    return;
                } else {
                    console.log("좋아요 삭제 성공");
                    res.status(200).json({ success: true, message: '좋아요 삭제 성공' });
                    return;
                }
            });
        } else { // 좋아요 존재 X -> 좋아요 추가
            const sql2 = 'INSERT INTO is_like (post_id, pk_id) VALUES (?, ?)';

            db.query(sql2, [post_id, pk_id], (err, result) => {
                if (err) {
                    console.error("좋아요 추가 실패 : ", err);
                    res.status(501).json({ success: false, message: '서버 오류' });
                    return
                } else {
                    console.log("좋아요 추가 성공");
                    res.status(200).json({ success: true, message: '좋아요 추가 성공' });
                    return
                }
            });
        }
    });
});
/*--------------------------------- 좋아요 ---------------------------------*/

app.post('/updateLikeNum', (req, res) => {
    const post_id = parseInt(req.body.post_id);

    const sql = "SELECT count(*) AS like_count FROM is_like WHERE post_id = ?"
    
    db.query(sql, [post_id], (err, result) => {
        if(err){
            console.log("좋아요 업데이트 실패")
            res.status(501).json({ success: false, message: '서버 오류' });
            return
        }else{
            console.log("좋아요 업데이트 성공", result)
            const like_count = parseInt(result[0].like_count) // 좋아요 수 가져오기

            const sql2 = "UPDATE post SET like_num = ? WHERE post_id = ?"

            db.query(sql2, [like_count, post_id],(err, result) => {
                if(err){
                    console.log("좋아요 업데이트 실패")
                    res.status(501).json({ success: false, message: '서버 오류' });
                    return
                }else{
                    console.log("좋아요 업데이트 성공")
                    return
                }
            })
        }
    })
})