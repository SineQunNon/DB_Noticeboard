import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import axios from 'axios';

import SignUpPage from './SignUpPage';
import $ from 'jquery';

function Login() {
  //로그인 변수
  const [signData, setSignData] = useState({
    id :'',
    pw : ''
  })

  //로그인 상태 변수
  const [isSigned, setIsSigned] = useState({
      pk_id : '',
      is_signed : false
  })

  const navigate = useNavigate();

  const LoginChange = (e) => {
    const { name, value } = e.target;
    setSignData({ ...signData, [name]: value });
  };

  const LoginSubmit = async (e) => {
    e.preventDefault();

        $.ajax({
        url: 'login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(signData),
        success: function(response){
            console.log("로그인 성공: ", response)
            setIsSigned({...isSigned, pk_id: response.pk_id, is_signed: true})
        },
        error:function(err){
            console.error('로그인 실패: ', err)
            alert('로그인 실패')
        }
        })
  };

  const handleSignUp = () => {
    navigate('/signuppage');
  };

  return (
    <div>
      <div className="title">DB 개론 게시판 구축 "로그인 페이지"</div>
      <input type="text" name="id" value={signData.id} onChange={LoginChange} placeholder="아이디" />
      <input type="text" name="pw" value={signData.pw} onChange={LoginChange} placeholder="비밀번호" />
      <button type="submit" onClick={LoginSubmit}>로그인</button>
      <button onClick={handleSignUp}>회원가입</button>
    </div>
  );
}

function App() {
    /*--------------------------------- 로그인 ---------------------------------*/

    //로그인 변수
    const [signData, setSignData] = useState({
        id :'',
        pw : ''
    })

    //로그인 상태 변수
    const [isSigned, setIsSigned] = useState({
        pk_id : '',
        is_signed : false
    })

    //로그인 기능 호출
    const LoginSubmit = async (e) => {
        e.preventDefault();

        $.ajax({
        url: 'login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(signData),
        success: function(response){
            console.log("로그인 성공: ", response)
            setIsSigned({...isSigned, pk_id: response.pk_id, is_signed: true})
        },
        error:function(err){
            console.error('로그인 실패: ', err)
            alert('로그인 실패')
        }
        })

        //try{
        //  const response = await axios.post('/login', signData)
        //  console.log(response.data)
        //  setIsSigned({...isSigned, pk_id:response.data.pk_id, is_signed:true})
        //}catch(err){
        //  console.log("로그인 실패 : ", err)
        //}
    }

        const LoginChange = (event) => {
            const { name, value } = event.target;
            setSignData({ ...signData, [name]: value });
        };
    /*--------------------------------- 로그인 ---------------------------------*/







    /*--------------------------------- 로그아웃 ---------------------------------*/
    const LogoutSubmit = async (e) => {
        e.preventDefault();
        console.log("로그아웃 성공")
        setIsSigned({...isSigned, pk_id:'', is_signed:false})
    }
    /*--------------------------------- 로그아웃 ---------------------------------*/









    /*--------------------------------- 게시글 작성 ---------------------------------*/
    const [postData, setPostData] = useState({
        pk_id : '',
        title : '',
        post_detail :''
    })

    const postSubmit = async (e) =>{
        e.preventDefault();

        if(!isSigned.is_signed){
        console.log("로그인 필요")
        return
        }else{
        setPostData(prevData => ({ ...prevData, pk_id: isSigned.pk_id }))
        }
        
        $.ajax({
        url: 'writepost',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(postData),
        success: function(response){
            console.log('게시글 작성 성공: ',response)
        },
        error:function(err){
            console.error('게시글 작성 실패: ',err)
        }
        })
        /*
        try{
        console.log(isSigned.pk_id)
        const response = await axios.post('/writepost', postData)
        console.log(response.data)
        }catch(err){
        console.log("게시글 작성 실패 : ", err)
        }
        */
    }

    const handlePostChange = (e) => {
        const { name, value }= e.target
        setPostData({ ...postData, [name]: value });
    }
    /*--------------------------------- 게시글 작성 ---------------------------------*/







    /*--------------------------------- 게시글 삭제 ---------------------------------*/
    const [selectPost, setSelectPost] = useState({
        post_id : ''
    })

    const handleDeleteCommentChange = (e) => {
        const { name, value }= e.target
        setSelectPost({ ...selectPost, [name]: value });
    }

    const deleteSubmit = async (e) => {
        e.preventDefault();
        if(!isSigned.is_signed){
        console.log("로그인 필요")
        return
        }
        
        $.ajax({
        url: 'deletepost',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(selectPost),
        success: function(response){
            console.log("게시글 삭제 성공: ", response)
        },
        error:function(err){
            console.err("게시글 삭제 실패: ", err)
        }
        })

        /*
        try{
        const response = await axios.post('/deletepost', selectPost)
        console.log(response)
        }catch(err){
        console.log("게시글 삭제 실패 : ", err)
        }
        */
    }
    /*--------------------------------- 게시글 삭제 ---------------------------------*/








    /*--------------------------------- 댓글 작성 ---------------------------------*/
    //댓글 작성
    const [commentData, setCommentData] = useState({
        pk_id : '',
        post_id : '',
        comment_id : ''
    })

    const handleCommentChange = (e) => {
        const { name, value }= e.target
        setCommentData({ ...commentData, [name]: value });
    }

    const commentSubmit = async (e) => {
        e.preventDefault();
        if(!isSigned.is_signed){
        console.log("로그인 필요")
        return
        }

        $.ajax({
        url: 'writecomment',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(commentData),
        success: function(response){
            console.log("댓글 작성 성공: ", response)
        },
        error:function(err){
            console.error("댓글 작성 실패: ", err)
        }
        })

        /*
        try{
        const response = await axios.post('/writecomment', commentData)
        console.log(response)
        }catch(err){
        console.log("댓글 작성 실패 : ", err)
        }
        */
    }
    /*--------------------------------- 댓글 작성 ---------------------------------*/







    /*--------------------------------- 댓글 삭제 ---------------------------------*/
    const commentDeleteSubmit = async (e) => {
        e.preventDefault();
        if(!isSigned.is_signed){
        console.log("로그인 필요")
        return
        }

        $.ajax({
        url: 'deletecomment',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(commentData),
        success: function(response){
            console.log("댓글 삭제 성공: ", response)
        },
        error:function(err){
            console.error('댓글 삭제 실패: ', err)
        }
        })

        /*
        try{
        const response = await axios.post('/deletecomment', commentData)
        console.log(response)
        }catch(err){
        console.log("댓글 작성 실패 : ", err)
        }
        */
    }
    /*--------------------------------- 댓글 삭제 ---------------------------------*/








    /*--------------------------------- 전체 글 조회 ---------------------------------*/
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [pageSize, setPageSize] = useState(5); // 페이지 당 항목 수
    const [posts, setPosts] = useState([]); // 페이지의 게시물 목록
    // 페이지의 게시물 목록을 불러오는 함수
    const fetchPosts = async () => {
        if(!isSigned.is_signed){
        console.log("로그인 필요")
        return
        }

        $.ajax({
        url: `/pagelist?page=${page}&pageSize=${pageSize}`,
        type: "GET",
        success: function(response) {
            setPosts(response.rows);
        },
        error: function(err) {
            console.error("페이지 조회 실패:", err);
        }
        });
        /*
        try {
        const response = await axios.get(`/pagelist?page=${page}&pageSize=${pageSize}`);
        setPosts(response.data.rows);
        } catch (err) {
        console.error("페이지 조회 실패:", err);
        }
        */
    };

    const handlePageChange = (increment) => {
        setPage(page + increment);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
    };
    /*--------------------------------- 전체 글 조회 ---------------------------------*/













    /*--------------------------------- 게시글 상세 조회 ---------------------------------*/


    const [onePostData, setOnePostData] = useState({
        pk_id : '',
        title : '',
        post_detail : '',
        post_id : '',
        post_date : '',
        like_num : '',
        comment_list : '',
    })

    const onePostSubmit = async (e) => {
        e.preventDefault();

        if(!isSigned.is_signed){
        console.log("로그인 필요")
        return
        }
        let post_id = selectPost.post_id

        $.ajax({
        url: `/pageinfo?post_id=${post_id}`,
        type: 'GET',
        success: function(response){
            console.log("게시글 상세조회 성공: ", response.rows)
            setOnePostData(response.rows)
        },
        error: function(err){
            console.error("게시글 상세조회 실패: ",err)
            alert('게시글 상세 조회 실패')
        }
        })
        /*
        try{
        const response = await axios.get(`/pageinfo?post_id=${post_id}`)
        
        console.log(response)
        }catch(err){
        console.log("게시글 상세 조회 실패 : ", err)
        }
        */
    }

    /*--------------------------------- 게시글 상세 조회 ---------------------------------*/
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signuppage" element={<SignUpPage />} />
        </Routes>
      </Router>
    );
}

export default App;