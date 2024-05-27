import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './App';
import $ from 'jquery';

function WritePost(){
    const { isSigned, setIsSigned } = useContext(GlobalContext);
    const navigate = useNavigate();

    /*--------------------------------- 게시글 작성 ---------------------------------*/
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
        
        $.ajax({
            url: 'writepost',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function(response){
                console.log('게시글 작성 성공: ',response)
                alert('게시글 작성 성공')
                navigate('/MainPage')
            },
            error:function(err){
                console.error('게시글 작성 실패: ',err)
                alert('게시글 작성 실패')
            }
        })
    }

    const handlePostChange = (e) => {
        const { name, value }= e.target
        setPostData({ ...postData, [name]: value });
    }
    /*--------------------------------- 게시글 작성 ---------------------------------*/

    return (
        <>
            <form onSubmit={postSubmit}>
                <input type="text" name="title" value={postData.title} onChange={handlePostChange} placeholder="제목"/>
                <input type="text" name="post_detail" value={postData.post_detail} onChange={handlePostChange} placeholder="내용"/>
                <button type="submit">게시글 작성</button>
            </form>
        </>
    )
}

export default WritePost;