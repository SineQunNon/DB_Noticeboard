
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './App';
import $ from 'jquery';

function Login() {
    // 로그인 변수
    const [signData, setSignData] = useState({
        id: '',
        pw: ''
    });

    const { isSigned, setIsSigned } = useContext(GlobalContext);
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
        success: function(response) {
            console.log("로그인 성공: ", response)
            setIsSigned({ ...isSigned, pk_id: response.pk_id, is_signed: true });
            navigate('/mainpage');
        },
        error: function(err) {
            console.error('로그인 실패: ', err)
            alert('로그인 실패')
        }
        });
    };

    const handleSignUp = () => {
        navigate('/signuppage');
    };

    return (
        <div>
            <div className="title">DB 개론 게시판 구축 "로그인 페이지"</div>
            <input type="text" name="id" value={signData.id} onChange={LoginChange} placeholder="아이디" />
            <input type="password" name="pw" value={signData.pw} onChange={LoginChange} placeholder="비밀번호" />
            <button type="submit" onClick={LoginSubmit}>로그인</button>
            <button onClick={handleSignUp}>회원가입</button>
        </div>
    );
}

export default Login;
