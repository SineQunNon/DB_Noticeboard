import React, { useState } from 'react';

function SignUpForm() {
  const [userData, setUserData] = useState({
    user_name: '',
    user_id: '',
    user_pw: '',
    phone_number: '',
    address: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      const data = await response.json();
      console.log('Signup response:', data);
      // 추가적인 작업 수행 (예: 리다이렉션 등)
    } catch (error) {
      console.error('Error signing up:', error);
      // 오류 처리
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="user_name" value={userData.user_name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="user_id" value={userData.user_id} onChange={handleChange} placeholder="User ID" required />
      <input type="password" name="user_pw" value={userData.user_pw} onChange={handleChange} placeholder="Password" required />
      <input type="tel" name="phone_number" value={userData.phone_number} onChange={handleChange} placeholder="Phone Number" required />
      <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Address" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpForm;
