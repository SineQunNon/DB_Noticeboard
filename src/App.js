import React, { useState } from 'react';
import axios from 'axios';

function NoticeForm() {
  /*--------------------------------- 회원 가입 ---------------------------------*/
  const [userData, setUserData] = useState({
    user_name: '',
    user_id: '',
    user_pw: '',
    phone_number: '',
    address: ''
  });

  //회원가입 기능 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 필수 필드를 배열에 담습니다.
    const requiredFields = ['user_name', 'user_id', 'user_pw', 'phone_number', 'address'];

    // 입력 데이터가 비어 있는지 확인합니다.
    if (requiredFields.some(field => !userData[field])) {
        console.log("모든 필수 필드를 입력해주세요.");
        return; // 필수 필드 중 하나라도 비어 있으면 함수를 종료합니다.
    }
    try{
      console.log("into", userData)
      const response = await axios.post('/signup', userData)
      
      console.log(response)
    }catch(err){
      console.log("회원가입 실패 : ", err)
    }
  }
  /*--------------------------------- 회원 가입 ---------------------------------*/







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



  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };


  //로그인 기능 호출
  const LoginSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('/login', signData)
      console.log(response.data)
      setIsSigned({...isSigned, pk_id:response.data.pk_id, is_signed:true})
    }catch(err){
      console.log("로그인 실패 : ", err)
    }
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

    try{
      console.log(isSigned.pk_id)
      const response = await axios.post('/writepost', postData)
      console.log(response.data)
    }catch(err){
      console.log("게시글 작성 실패 : ", err)
    }
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
    
    try{
      const response = await axios.post('/deletepost', selectPost)
      console.log(response)
    }catch(err){
      console.log("게시글 삭제 실패 : ", err)
    }
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

    try{
      const response = await axios.post('/writecomment', commentData)
      console.log(response)
    }catch(err){
      console.log("댓글 작성 실패 : ", err)
    }
  }
  /*--------------------------------- 댓글 작성 ---------------------------------*/







  /*--------------------------------- 댓글 삭제 ---------------------------------*/
  const commentDeleteSubmit = async (e) => {
    e.preventDefault();
    if(!isSigned.is_signed){
      console.log("로그인 필요")
      return
    }

    try{
      const response = await axios.post('/deletecomment', commentData)
      console.log(response)
    }catch(err){
      console.log("댓글 작성 실패 : ", err)
    }
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
    try {
      const response = await axios.get(`/pagelist?page=${page}&pageSize=${pageSize}`);
      setPosts(response.data.rows);
    } catch (err) {
      console.error("페이지 조회 실패:", err);
    }
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
    try{
      const response = await axios.get(`/pageinfo?post_id=${post_id}`)
      
      console.log(response)
    }catch(err){
      console.log("게시글 상세 조회 실패 : ", err)
    }
  }

/*--------------------------------- 게시글 상세 조회 ---------------------------------*/





  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="user_name" value={userData.user_name} onChange={handleChange} placeholder="이름"/>
          <input type="text" name="user_id" value={userData.user_id} onChange={handleChange} placeholder="아이디"/>
          <input type="password" name="user_pw" value={userData.user_pw} onChange={handleChange} placeholder="비밀번호"/>
          <input type="tel" name="phone_number" value={userData.phone_number} onChange={handleChange} placeholder="전화번호"/>
          <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="주소"/>
          <button type="submit">회원가입</button>
        </form>
      </div>
      <div>
        <form onSubmit={LoginSubmit}>
          <input type="text" name='id' value={signData.id} onChange={LoginChange} placeholder="아이디"/>
          <input type="text" name='pw' value={signData.pw} onChange={LoginChange} placeholder="비밀번호"/>
          <button type="submit">로그인</button>
        </form>
      </div>
        <button type="submit" onClick={LogoutSubmit}>로그아웃</button>
      <div></div><div></div>
      <button type="button" onClick={() => handlePageChange(-1)}>이전 페이지</button>
      <button type="button" onClick={() => handlePageChange(1)}>다음 페이지</button>
      <button type="button" onClick={fetchPosts}>게시글 전체 조회</button>
      <ul>
      {posts.map((post, index) => (
        <li key={index}>
          <div>Title: {post.title}</div>
          <div>Like Number: {post.like_num}</div>
          <div>Post Date: {post.post_date}</div>
          <div>User Name: {post.user_name}</div>
        </li>
      ))}
      </ul>

      <div>
        <form onSubmit={postSubmit}>
          <input type="text" name="title" value={postData.title} onChange={handlePostChange} placeholder="제목"/>
          <input type="text" name="post_detail" value={postData.post_detail} onChange={handlePostChange} placeholder="내용"/>
          <button type="submit">게시글 작성</button>
        </form>
      </div>
        <input type="text" name="post_id" value={selectPost.post_id} onChange={handleDeleteCommentChange} placeholder="삭제할 게시 글 post_id"/>
        <button type="submit" onClick={deleteSubmit}>게시글 삭제</button>
      <div>
        <input type="text" name="post_id" value={commentData.post_id} onChange={handleCommentChange} placeholder="댓글 작성할 post_id"/>
        <input type="text" name="pk_id" value={commentData.pk_id} onChange={handleCommentChange} placeholder="pk_id"/>
        <input type="text" name="comment_detail" value={commentData.comment_detail} onChange={handleCommentChange} placeholder="댓글 내용"/>
        <button type="submit" onClick={commentSubmit}>댓글 작성</button>
      </div>
      <div>
        <input type="text" name="comment_id" value={commentData.comment_id} onChange={handleCommentChange} placeholder="삭제할 댓글 comment_id"/>
        <button type="submit" onClick={commentDeleteSubmit}>댓글 삭제</button>
      </div>
      <div>
      <input type="text" name="post_id" value={selectPost.post_id} onChange={handleDeleteCommentChange} placeholder="상세 조회할 게시 글 post_id"/>
        <button type="submit" onClick={onePostSubmit}>게시글 상제 조회</button>
      </div>
    </>
  );
}

export default NoticeForm;

