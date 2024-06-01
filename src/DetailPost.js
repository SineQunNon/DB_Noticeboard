import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from './App';
import $ from 'jquery';

function DetailPost() {
    const { isSigned } = useContext(GlobalContext);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSigned.is_signed) {
            console.log("로그인 필요");
            return;
        }

        const fetchDetails = async () => {
            try {
                const postResponse = await $.ajax({
                    url: `/pageinfo?post_id=${postId}`,
                    type: 'GET'
                });

                console.log("게시글 상세조회 성공: ", postResponse.rows);
                setPost(postResponse.rows[0]);

                const commentsResponse = await $.ajax({
                    url: `/commentslist?post_id=${postId}`,
                    type: 'GET'
                });

                console.log("댓글 조회 성공: ", commentsResponse.rows);
                setComments(commentsResponse.rows);

            } catch (err) {
                console.error("데이터 조회 실패: ", err);
                alert('데이터 조회 실패');
            }
        };

        fetchDetails();

        setCommentData({
            ...commentData,
            pk_id: isSigned.pk_id,
            post_id: postId
        });
    }, [isSigned, postId]);


    /*--------------------------------- 게시글 삭제 ---------------------------------*/
    const deleteSubmit = async (e) => {
        e.preventDefault();
        if(!isSigned.is_signed){
            console.log("로그인 필요")
            return
        }
        
        $.ajax({
            url: '/deletepost',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({post_id : postId}),
            success: function(response){
                console.log("게시글 삭제 성공: ", response)
                alert('게시 글 삭제 성공')
                navigate('/MainPage')
            },
            error:function(err){
                console.error("게시글 삭제 실패: ", err)
            }
        })
    }
    /*--------------------------------- 게시글 삭제 ---------------------------------*/





    /*--------------------------------- 댓글 작성 ---------------------------------*/
    //댓글 작성
    const [commentData, setCommentData] = useState({
        pk_id : '',
        post_id : '',
        comment_detail : ''
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

        console.log("댓글 작성 데이터 : ", commentData)

        $.ajax({
            url: '/writecomment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(commentData),
            success: function(response){
                console.log("댓글 작성 성공: ", response)
            },
            error:function(err){
                console.error("댓글 작성 실패: ", err)
            }
        })
    }
    /*--------------------------------- 댓글 작성 ---------------------------------*/







    /*--------------------------------- 댓글 삭제 ---------------------------------*/
    const commentDeleteSubmit = async (commentId) => {
        
        if(!isSigned.is_signed){
            console.log("로그인 필요")
            return
        }
        console.log("댓글 삭제 데이터 : ", commentId, isSigned.pk_id)

        $.ajax({
            url: '/deletecomment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ comment_id: commentId, pk_id: isSigned.pk_id }),
            success: function(response){
                console.log("댓글 삭제 성공: ", response)
                // 댓글 삭제 후 댓글 목록 새로 고침
                setComments(comments.filter(comment => comment.comment_id !== commentId));
            },
            error:function(err){
                console.error('댓글 삭제 실패: ', err)
            }
        })
    }
    /*--------------------------------- 댓글 삭제 ---------------------------------*/

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            
            <h1>제목 : {post.title}</h1>
            <div>고유번호: {post.post_id}</div>
            <div>좋아요: {post.like_num}</div>
            <div>작성일자: {post.post_date}</div>
            <div>작성자: {post.user_name}</div>
            <div>내용: {post.post_detail}</div>
            { post.pk_id ===isSigned.pk_id && (
                <button onClick={deleteSubmit}>게시글 삭제</button>
            )}
            <div/>
            <h2>댓글</h2>
            <table>
                <thead>
                    <tr>
                        <th>작성자</th>
                        <th>내용</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.map((comment, index) =>(
                        <tr key={index}>
                            <td>{comment.user_name}</td>
                            <td>{comment.comment_detail}</td>
                            <td>{comment.comment_date}</td>
                            <td>{comment.pk_id === isSigned.pk_id && (
                                <button onClick={() => commentDeleteSubmit(comment.comment_id)}>댓글 삭제</button>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <input type="text" name="comment_detail" value={commentData.comment_detail} onChange={handleCommentChange} placeholder="댓글 내용"/>
                <button type="submit" onClick={commentSubmit}>댓글 작성</button>
            </div>
        </div>
    );
}

export default DetailPost;
