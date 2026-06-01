import React from 'react'
import Feed from './Feed'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const Profile = () => {

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            setUser(res.data);
        })
        .catch((err)=>{
            console.log(err);
            setUser(null);
        });
    }, []);

    useEffect(()=>{
        axios.get('http://localhost:3000/api/post/myPosts',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            console.log(res.data);
            setPosts(res.data.posts)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[]);

    function logout(){
        axios.get('http://localhost:3000/api/auth/logout', 
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            navigate('/login');
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    if(!user){
        return <div className='h-full flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className='h-screen p-5 overflow-y-auto hide-scrollbar'>
        <div className=' p-7 flex flex-col gap-5'>
            <div>
                <div className=' h-10 flex py-2 px-1 items-center gap-5'>
                    <button onClick={(()=>logout())} className='ml-auto border rounded py-1 px-2'><i class="ri-logout-box-r-line"></i></button>
                </div>
                <div className='flex  h-50 items-center gap-20'>
                    <div className='border h-40 w-40 rounded-full flex items-center justify-center text-[170px] overflow-hidden'>
                        <i class="ri-user-line"></i>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-4xl font-bold'>{user.username}</h1>
                        <h1 className='text-2xl font-semibold'>{`${user.fullName.firstName} ${user.fullName.lastName}`}</h1>
                        <div className='flex font-semibold gap-12'>
                            <div className='flex gap-1'>
                                <h1>{`${user.createdPosts.length} posts`}</h1>
                            </div>
                            <div className='flex gap-1'>
                                <h1>{`${user.friends.length} friends`}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' h-10 flex py-2 px-5 items-center gap-5'>
                    <button className='border rounded py-1 px-2 gap-2 flex'>
                        <i class="ri-pencil-fill"></i>
                        <h1 className='font-semibold'>Edit Profile</h1>
                    </button>
                </div>   
            </div>

            <div className=' flex px-1 py-5 gap-2 font-semibold justify-between'>
                <Link to='/likedPosts'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-heart-3-fill"></i>
                        </div>
                        <h1>{`Liked Posts: ${user.likedPosts.length}`}</h1>
                    </div>
                </Link>
                <Link to='/commentedPosts'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-chat-1-fill"></i>
                        </div>
                        <h1>{`Commented Posts: ${user.comments.length}`}</h1>
                    </div>
                </Link>
                <Link to='/savedPosts'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-bookmark-fill"></i>
                        </div>
                        <h1>{`Saved Posts: ${user.savedPosts.length}`}</h1>
                    </div>
                </Link>
            </div>

            <div className=' flex flex-col gap-2'>
                <div className='text-xl font-semibold py-1'>
                    <h1>Your Posts</h1>
                </div>
                <div className='flex flex-wrap py-3 justify-between gap-y-10'>
                    {
                        posts.map((post, index)=>(
                            <Feed key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>

        </div>
    </div>
  )
}

export default Profile
