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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="user_name" value={userData.user_name} onChange={handleChange}/>
        <input type="text" name="user_id" value={userData.user_id} onChange={handleChange}/>
        <input type="password" name="user_pw" value={userData.user_pw} onChange={handleChange}/>
        <input type="tel" name="phone_number" value={userData.phone_number} onChange={handleChange}/>
        <input type="text" name="address" value={userData.address} onChange={handleChange}/>
        <button type="submit">회원가입</button>
      </form>
    </div>    
  );
}

export default SignUpForm;

