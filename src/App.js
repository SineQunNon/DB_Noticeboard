import React, { useState } from 'react';
import axios from 'axios';

function SignUpForm() {
  const [userData, setUserData] = useState({
    user_name: '',
    user_id: '',
    user_pw: '',
    phone_number: '',
    address: ''
  });

  const [signData, setSignData] = useState({
    id :'',
    pw : ''
  })

  const [isSigned, setIsSigned] = useState({
    
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      console.log("into", userData)
      const response = await axios.post('/signup', userData)
      console.log(response.data)
    }catch(err){
      console.log("회원가입 실패 : ", err)
    }
  }

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try{
      console.log("into", userData)
      const response = await axios.post('/login', signData)
      console.log(response.data)
    }catch(err){
      console.log("로그인 실패 : ", err)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleChange2 = (event) => {
    const { name, value } = event.target;
    setSignData({ ...signData, [name]: value });
  };

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
        <form onSubmit={handleSubmit2}>
          <input type="text" name='id' value={signData.id} onChange={handleChange2} placeholder="아이디"/>
          <input type="text" name='pw' value={signData.pw} onChange={handleChange2} placeholder="비밀번호"/>
          <button type="submit">로그인</button>
        </form>
      </div>
    </>
  );
}

export default SignUpForm;

