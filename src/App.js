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

  //로그아웃
  const LogoutSubmit = async (e) => {
    e.preventDefault();

    setIsSigned({...isSigned, pk_id:'', is_signed:false})
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };
  const LoginChange = (event) => {
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
        <form onSubmit={LoginSubmit}>
          <input type="text" name='id' value={signData.id} onChange={LoginChange} placeholder="아이디"/>
          <input type="text" name='pw' value={signData.pw} onChange={LoginChange} placeholder="비밀번호"/>
          <button type="submit">로그인</button>
        </form>
      </div>
        <button type="submit" onClick={LogoutSubmit}>로그아웃</button>
    </>
  );
}

export default SignUpForm;

