import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Feed = ({post, user}) => {

    const location = useLocation();
    const [like, setLike] = useState(post.likes.length);
    const [commentStatus, setCommentStatus] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments);
    const [saves, setSavesCount] = useState(post.saves.length);
    const navigate = useNavigate();

    const[me, setMe] = useState(null);

    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/api/auth/findUser', {
            withCredentials: true
        })
        .then((res) => {
            setMe(res.data);

            setIsLiked(
                res.data.likedPosts.some(id =>
                    id.toString() === post._id.toString()
                )
            );

            setIsSaved(
                res.data.savedPosts.some(id =>
                    id.toString() === post._id.toString()
                )
            );

        })
        .catch((err) => {
            // console.log(err);
            setMe(null);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        });
    }, [like, post._id, saves]);

    // console.log("post: ", post)
    // console.log("user: ", user);

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
            // console.log(res);
            setComments(res.data.totalComments);
            setComment('');
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    function deleteComment (postId, comment, commentId){
        axios.post('http://localhost:3000/api/post/removeComment', 
            {postId, comment, commentId},
            {withCredentials: true}
        )
        .then((res)=>{
            // console.log(res);
            setComments(res.data.totalComments);
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    function savePost (postId){
        axios.post('http://localhost:3000/api/post/save', 
            {postId},
            {withCredentials: true}
        )
        .then((res)=>{
            // console.log(res);
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
                    // console.log(res);
                    setSavesCount(res.data.totalSaves)
                })
                .catch(console.log);
            }
        })
    }

  return (
    <div className='flex gap-20'>
            <div className={`shadow-[0_10px_40px_rgba(0,0,0,0.6)] rounded-2xl ${location.pathname === '/' || location.pathname.startsWith('/post') ? "w-180":"w-120"} bg-[#1F2128] h-fit overflow-hidden text-white rounded-md flex flex-col`}>
                <div className='flex py-3 px-4 items-center gap-2'>
                    <label onClick={() => navigate(`/userProfile/${post.user}`)} className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                        {!post.profilePic ? (
                        <div className="h-full w-full flex items-center justify-center text-2xl">
                            <i className="ri-user-line"></i>
                        </div>
                        ) : (
                        <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden">
                            <img
                                src={post.profilePic}
                                alt="Profile Preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        )}
                    </label>
                    <h1 className='font-semibold '>{post.username}</h1>
                </div>
                <div className='flex flex-col'>
                    <div className={`${location.pathname === '/' ? "h-100":"h-100"}`}>
                        <img src={post.image} className='h-full w-full object-cover' alt="postImage" />
                    </div>
                    <div className='py-3 px-4 font-semibold'>
                        <h1>{post.caption}</h1>
                    </div>
                    <div className='flex justify-between px-8 py-2 text-[#808191] mb-1'>
                        <div onClick={() => likePost(post._id)} className='flex items-center gap-1 text-2xl'>
                            <div className={`${isLiked? "hidden": "flex"} hover:text-rose-400`}>
                                <i class="ri-heart-3-line"></i>
                            </div>
                            <div className={`${isLiked? "flex": "hidden"} text-rose-400`}>
                                <i class="ri-heart-3-fill"></i>
                            </div>
                            <h1 className={`${like > 0 ? "flex" : "hidden"} text-sm font-semibold ${isLiked? "text-rose-400": ""}`}>{like}</h1>
                        </div>
                        <div onClick={(()=>setCommentStatus(!commentStatus))} className='flex items-center gap-1 text-2xl hover:text-white'>
                            <i class="ri-chat-1-line"></i>
                            <h1 className={` ${comments?.length > 0 ? "flex" : "hidden"} text-sm font-semibold`}>{comments.length}</h1>
                        </div>
                        <div type="button" onClick={()=>navigator.clipboard.writeText(`http://localhost:5173/post/${post._id}`)} className='hover:text-white cursor-pointer flex items-center gap-1 text-2xl'>
                            <i class="ri-link"></i>
                        </div>
                        <div onClick={() => savePost(post._id)} className='flex items-center gap-1 text-2xl hover:text-white'>
                            <div className={`${isSaved? "hidden": "flex"}`}>
                                <i class="ri-bookmark-line"></i>
                            </div>
                            <div className={`${isSaved? "flex": "hidden"}`}>
                                <i class="ri-bookmark-fill"></i>
                            </div>
                            <h1 className={` ${saves > 0 ? "flex" : "hidden"} text-sm font-semibold`}>{saves}</h1>
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
                                    <div key={comment._id} className=' flex items-center gap-3'>
                                        <Link to={`/userProfile/${comment.user}`} className=" h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                                            {!comment?.profilePic ? (
                                            <div className="h-full w-full flex items-center justify-center text-2xl">
                                                <i className="ri-user-line"></i>
                                            </div>
                                            ) : (
                                            <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                                                <img
                                                    src={comment.profilePic}
                                                    alt="Profile Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            )}
                                        </Link>
                                        <Link to={`/userProfile/${comment.user}`} className='flex flex-1 gap-2 flex'>
                                            <h1 className='font-semibold'>{comment.username}</h1>
                                            <h1 className='break-all'>{comment.text}</h1>
                                        </Link>
                                        {comment.user === user?._id && (
                                            <button className='mr-3' type="button" onClick={(()=>deleteComment(post._id, comment.text, comment._id))}>
                                                <i className="ri-delete-bin-2-line"></i>
                                            </button>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                        <div className='h-fit my-3 flex gap-1'>
                            <input value={comment} onChange={(e)=>setComment(e.target.value)} className='focus:outline-none rounded w-full py-2 px-3' placeholder='Comment...' type="text" />
                            <button type='submit' className=' px-3 py-1 rounded'><i class="ri-send-plane-2-line"></i></button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
  )
}

export default Feed
