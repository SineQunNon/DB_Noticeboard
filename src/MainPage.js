import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './App';
import $ from 'jquery';

function MainPage() {
    const { isSigned, setIsSigned } = useContext(GlobalContext);
    const navigate = useNavigate();

    const toWritePost = () =>{
        navigate('/writepost')
    }
    
    const toDetailPost = (postId) => {
        navigate(`/detailpost/${postId}`);
    }

    
    /*--------------------------------- 로그아웃 ---------------------------------*/
    const LogoutSubmit = async (e) => {
        e.preventDefault();
        console.log("로그아웃 성공");
        setIsSigned({ pk_id: '', is_signed: false });
        navigate('/');
    }
    /*--------------------------------- 로그아웃 ---------------------------------*/


    /*--------------------------------- 전체 글 조회 ---------------------------------*/
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [pageSize, setPageSize] = useState(5); // 페이지 당 항목 수
    const [posts, setPosts] = useState([]); // 페이지의 게시물 목록

    const fetchPosts = async () => {
        if (!isSigned.is_signed) {
            console.log("로그인 필요");
            return;
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
    };

    const handlePageChange = (increment) => {
        setPage(page + increment);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
    };
    /*--------------------------------- 전체 글 조회 ---------------------------------*/

    /*--------------------------------- 좋아요 ---------------------------------*/

    const updateLike = (postId) => {
        if (!isSigned.is_signed) {
            console.log("로그인 필요");
            return;
        }
    
        // 좋아요 업데이트 요청
        $.ajax({
            url: `/updateLike`,
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ post_id: postId, pk_id: isSigned.pk_id }),
            success: function(response){
                console.log("좋아요 업데이트 성공: ", response);
    
                // 좋아요 업데이트 성공 후 좋아요 수 업데이트 요청
                updateLikeNum(postId);
            },
            error: function(err){
                console.error("좋아요 업데이트 실패: ", err);
            }
        });
    }
    
    const updateLikeNum = (postId) => {
        // 좋아요 수 업데이트 요청
        $.ajax({
            url: `/updateLikeNum`,
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ post_id: postId }),
            success: function(response){
                console.log("좋아요 수 업데이트 성공: ", response);
            },
            error: function(err){
                console.error("좋아요 수 업데이트 실패: ", err);
            }
        });
    }

    /*--------------------------------- 좋아요 ---------------------------------*/

    return (
        <div>
        <div className="title">DB 개론 게시판 구축 "메인페이지"</div>
        <button type="submit" onClick={LogoutSubmit}>로그아웃</button>
        <div>
            <button onClick={toWritePost}>게시글 작성</button>
        </div>
        <button type="button" onClick={fetchPosts}>게시글 전체 조회</button>
        <ul>
            {posts.map((post, index) => (
            <li key={index}>
                <button onClick={() => toDetailPost(post.post_id)}>게시글 상세 조회</button>
                <div>{post.title}</div>
                <div>고유번호: {post.post_id}</div>
                <button onClick={() => updateLike(post.post_id)}>좋아요</button>
                <div>좋아요: {post.like_num}</div>
                <div>작성일자: {post.post_date}</div>
                <div>작성자: {post.user_name}</div>
            </li>
            ))}
        </ul>
        <button type="button" onClick={() => handlePageChange(-1)}>이전 페이지</button>
        <button type="button" onClick={() => handlePageChange(1)}>다음 페이지</button>
        </div>
    );
    }

export default MainPage;
