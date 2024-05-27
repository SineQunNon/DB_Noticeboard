import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

function SignUpPage() {
    const navigate = useNavigate();
    /*--------------------------------- 회원 가입 ---------------------------------*/
    const [userData, setUserData] = useState({
        user_name: '',
        user_id: '',
        user_pw: '',
        phone_number: '',
        address: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

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

        $.ajax({
        url: '/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function(response) {
            console.log('회원가입 성공:', response);
            alert('회원가입에 성공했습니다.');
            navigate('/'); // 홈으로 이동
        },
        error: function(err) {
            console.error('회원가입 실패:', err);
            alert('회원가입에 실패했습니다.');
        }
        });
    }
    /*--------------------------------- 회원 가입 ---------------------------------*/

    return (
        <div>
            <div className="title">DB 개론 게시판 구축 "회원가입 페이지"</div>
            <div>
                <input type="text" name="user_name" value={userData.user_name} onChange={handleChange} placeholder="이름"/>
                <input type="text" name="user_id" value={userData.user_id} onChange={handleChange} placeholder="아이디"/>
                <input type="password" name="user_pw" value={userData.user_pw} onChange={handleChange} placeholder="비밀번호"/>
                <input type="tel" name="phone_number" value={userData.phone_number} onChange={handleChange} placeholder="전화번호"/>
                <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="주소"/>
                <button type="submit" onClick={handleSubmit}>회원가입</button>
            </div>
        </div>
    )
}

export default SignUpPage;