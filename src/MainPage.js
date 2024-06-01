import React, { useState, useContext, useEffect } from 'react';

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

    /*--------------------------------- 전체 글 조회 ---------------------------------*/

    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [pageSize, setPageSize] = useState(5); // 페이지 당 항목 수
    const [posts, setPosts] = useState([]); // 페이지의 게시물 목록
    const [totalPages, setTotalPages] = useState(0) //전체 페이지 수

    const handlePageChange = (increment) => {
        setPage(page + increment);
    };

    useEffect(() => {
        if(!isSigned.is_signed){
            console.log("로그인 필요");
            return
        }

        const fetchPosts = async () => {
            if (!isSigned.is_signed) {
                console.log("로그인 필요");
                return;
            }

            $.ajax({
                url: `/getpagetotal`,
                type: "GET",
                success: function(response){
                    console.log(response.total)
                    setTotalPages(Math.ceil(response.total / pageSize))
                },
                error: function(err){
                    console.error("전체 페이지 개수 조회 실패:", err);
                }
            })
    
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

        fetchPosts();

    },[isSigned, page,pageSize]);

    /*--------------------------------- 전체 글 조회 ---------------------------------*/
    
    
    /*--------------------------------- 로그아웃 ---------------------------------*/
    const LogoutSubmit = async (e) => {
        e.preventDefault();
        console.log("로그아웃 성공");
        setIsSigned({ pk_id: '', is_signed: false });
        navigate('/');
    }
    /*--------------------------------- 로그아웃 ---------------------------------*/


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
        
        <table>
            <thead>
                <tr>
                    <th>고유번호</th>
                    <th>제목</th>
                    <th>작성일자</th>
                    <th>작성자</th>
                    <th>좋아요 수</th>                  
                </tr>
            </thead>
            <tbody>
                {posts.map((post, index) => (
                <tr key={post.post_id}>
                    <td>{post.post_id}</td>
                    {/* <td><button>게시글 상세 조회</button></td> */}
                    <td  onClick={() => toDetailPost(post.post_id)}>{post.title}</td>                    
                    <td>{post.post_date}</td>
                    <td>{post.user_name}</td>
                    <td>{post.like_num}</td>
                    <td><button onClick={() => updateLike(post.post_id)}>좋아요</button></td>
                </tr>
                ))}
            </tbody>
        </table>

        <div>
            <button onClick={() => handlePageChange(-1)} disabled={page === 1}>이전</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    style={{ fontWeight: page === pageNum ? 'bold' : 'normal' }}>
                {pageNum}
                </button>
            ))}
            <button onClick={() => handlePageChange(1)} disabled={page === totalPages}>다음</button>
        </div>
        </div>
    );
    }

export default MainPage;
