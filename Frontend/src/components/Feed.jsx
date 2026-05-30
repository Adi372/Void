import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Feed = ({post, user}) => {

    const [like, setLike] = useState(post.likes.length);
    const [commentStatus, setCommentStatus] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments);
    const [saves, setSavesCount] = useState(post.saves.length);
    const navigate = useNavigate();

    function likePost (post){
        axios.post('http://localhost:3000/api/post/like',
            {post},
            {withCredentials: true}
        )
        .then((res)=>{
            setLike(res.data.totalLikesLength);
        })
        .catch((err)=>{
            if(err.response?.status === 400){
                axios.post(
                    'http://localhost:3000/api/post/removeLike',
                    { post },
                    { withCredentials: true }
                )
                .then((res)=>{
                    setLike(res.data.totalLikesLength);
                })
                .catch(console.log);
            }
        })
    }

    function submitComment (postId, comment){
        if(!comment.trim()) return;
        axios.post('http://localhost:3000/api/post/comment',
            {postId, comment},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res);
            setComments(res.data.totalComments);
            setComment('');
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function deleteComment (postId, comment, commentId){
        axios.post('http://localhost:3000/api/post/removeComment', 
            {postId, comment, commentId},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res);
            setComments(res.data.totalComments);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function savePost (postId){
        axios.post('http://localhost:3000/api/post/save', 
            {postId},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res);
            setSavesCount(res.data.totalSaves)
        })
        .catch((err)=>{
            if(err.response?.status === 400){
                axios.post(
                    'http://localhost:3000/api/post/unsave',
                    { postId },
                    {withCredentials: true}
                )
                .then((res)=>{
                    console.log(res);
                    setSavesCount(res.data.totalSaves)
                })
                .catch(console.log);
            }
        })
    }


  return (
    <div className='flex gap-20'>
            <div className='w-120 h-fit overflow-hidden border rounded-md flex flex-col'>
                <div className='flex py-3 px-4 items-center gap-2 border-b'>
                    <div onClick={() => navigate(`/userProfile/${post.user}`)} className='border h-10 w-10 rounded-full flex items-center justify-center '>
                        <i class="ri-user-line"></i>
                    </div>
                    <h1 className='font-semibold'>{post.username}</h1>
                </div>
                <div className='flex flex-col'>
                    <div className='h-100 border-b'></div>
                    <div className='border-b py-3 px-4 font-semibold'>
                        <h1>{post.caption}</h1>
                    </div>
                    <div className='flex justify-between px-4 py-2'>
                        <div onClick={() => likePost(post._id)} className='flex items-center gap-1 text-2xl'>
                            <i class="ri-heart-3-line"></i>
                            <h1 className='text-sm font-semibold'>{like}</h1>
                        </div>
                        <div onClick={(()=>setCommentStatus(!commentStatus))} className='flex items-center gap-1 text-2xl'>
                            <i class="ri-chat-1-line"></i>
                            <h1 className='text-sm font-semibold'>{comments.length}</h1>
                        </div>
                        <div type="button" onClick={()=>navigator.clipboard.writeText(`http://localhost:5173/post/${post._id}`)} className='flex items-center gap-1 text-2xl'>
                            <i class="ri-link"></i>
                        </div>
                        <div onClick={() => savePost(post._id)} className='flex items-center gap-1 text-2xl'>
                            <i class="ri-bookmark-line"></i>
                            <h1 className='text-sm font-semibold'>{saves}</h1>
                        </div>  
                    </div>
                    <form 
                        onSubmit={(e)=>{
                            e.preventDefault();
                            submitComment(post._id, comment);
                            }} 
                            className={` ${commentStatus? "flex":"hidden"} h-fit max-h-50 w-full  flex flex-col px-2`}>
                        <div className='h-full overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col gap-2'>
                            {
                                comments.map((comment)=>(
                                    <div key={comment._id} className='border flex items-center gap-3'>
                                        <div className='self-start h-10 w-10 border rounded-full flex justify-center items-center'>
                                            <i class="ri-user-line"></i>
                                        </div>
                                        <div className='flex flex-1 gap-2 flex'>
                                            <h1 className='font-semibold'>{comment.username}</h1>
                                            <h1 className='break-all'>{comment.text}</h1>
                                        </div>
                                        {comment.user === user._id && (
                                            <button type="button" onClick={(()=>deleteComment(post._id, comment.text, comment._id))}>
                                                <i className="ri-delete-bin-2-line"></i>
                                            </button>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                        <div className='h-fit mb-1 flex gap-1'>
                            <input value={comment} onChange={(e)=>setComment(e.target.value)} className='border rounded w-full py-2 px-3' placeholder='Comment...' type="text" />
                            <button type='submit' className='border px-3 py-1 rounded border-2'><i class="ri-send-plane-2-line"></i></button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
  )
}

export default Feed
