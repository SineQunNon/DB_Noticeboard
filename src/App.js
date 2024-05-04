import React, { useState } from 'react';
import axios from 'axios';

function SignUpForm() {
  //회원가입 변수
  const [userData, setUserData] = useState({
    user_name: '',
    user_id: '',
    user_pw: '',
    phone_number: '',
    address: ''
  });

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

  //로그아웃
  const LogoutSubmit = async (e) => {
    e.preventDefault();
    console.log("로그아웃 성공")
    setIsSigned({...isSigned, pk_id:'', is_signed:false})
  }
  
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [pageSize, setPageSize] = useState(10); // 페이지 당 항목 수
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
  

  //게시글 작성 변수
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
      <button type="button" onClick={fetchPosts}>조회</button>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>{post.title}</li>
        ))}
      </ul>

      <div>
        <form onSubmit={postSubmit}>
          <input type="text" name="title" value={postData.title} onChange={handlePostChange} placeholder="제목"/>
          <input type="text" name="post_detail" value={postData.post_detail} onChange={handlePostChange} placeholder="내용"/>
          <button type="submit">게시글 작성</button>
        </form>
      </div>
    </>
  );
}

export default SignUpForm;

