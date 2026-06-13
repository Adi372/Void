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
        axios.get('https://void-tup9.onrender.com/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            setUser(res.data);
        })
        .catch((err)=>{
            // console.log(err);
            setUser(null);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        });
    }, []);

    useEffect(()=>{
        axios.get('https://void-tup9.onrender.com/api/post/myPosts',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            // console.log(res.data);
            setPosts(res.data.posts)
        })
        .catch((err)=>{
            // console.log(err)
        })
    },[]);

    function logout(){
        axios.get('https://void-tup9.onrender.com/api/auth/logout', 
            {withCredentials: true}
        )
        .then((res)=>{
            // console.log(res.data);
            navigate('/login');
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    function deleteAccount(){
        axios.get('https://void-tup9.onrender.com/api/auth/delete', 
            {withCredentials: true}
        )
        .then((res)=>{
            // console.log(res.data);
            navigate('/register');
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    if(!user){
        return <div className='h-full text-[#808191] flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className='h-screen p-5 overflow-y-auto hide-scrollbar'>
        <div className=' p-7 flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
                <div className=' flex py-2 px-1 justify-end gap-5 '>
                    <button onClick={(()=>deleteAccount())} className='hover:bg-[#4F3ECA] bg-[#6B5DD3] rounded-2xl text-white w-fit py-3 px-5 font-semibold'>Delete Account <i class="ri-delete-bin-7-line"></i></button>
                    <button onClick={(()=>logout())} className='w-fit hover:bg-[#4F3ECA] bg-[#6B5DD3] rounded-2xl text-white py-3 px-5 font-semibold'>Logout <i class="ri-logout-box-r-line"></i></button>
                    
                </div>
                <div className=' flex h-50 items-center gap-20'>
                    {!user.profilePic ? (
                        <div className="text-white h-40 w-40 border rounded-full flex items-center justify-center overflow-hidden text-[160px]">
                            <div className='mt-2.5'>
                                <i class="ri-user-fill"></i>
                            </div>
                        </div>
                        ) : (

                        <div className="h-40 w-40 rounded-full flex items-center justify-center overflow-hidden text-[160px]">
                            <img
                                src={user.profilePic}
                                alt="Profile Preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                    <div className='flex flex-col gap-3 text-white'>
                        <h1 className='text-4xl font-bold'>{user.username}</h1>
                        <h1 className='text-2xl font-semibold'>{`${user.fullName.firstName} ${user.fullName.lastName}`}</h1>
                        <div className='flex font-semibold gap-12 text-[#808191]'>
                            <div className='flex gap-1'>
                                <h1>{`${user.createdPosts.length} posts`}</h1>
                            </div>
                            <Link to='/friends' className='flex gap-1 hover:text-white'>
                                <h1>{`${user.friends.length} friends`}</h1>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className=' h-full w-40 flex justify-center'>
                    <Link className='rounded-2xl font-semibold px-8 py-3 hover:bg-[#4F3ECA] bg-[#6B5DD3] text-white' to='/EditProfile'>Edit Profile</Link>
                </div>
            </div>

            <div className=' flex px-1 py-5 gap-2 font-semibold justify-between text-[#808191]'>
                <Link to='/likedPosts' className='hover:text-white'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-heart-3-fill"></i>
                        </div>
                        <h1>{`Liked Posts: ${user.likedPosts.length}`}</h1>
                    </div>
                </Link>
                <Link to='/commentedPosts' className='hover:text-white'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-chat-1-fill"></i>
                        </div>
                        <h1>{`Commented Posts: ${user.comments.length}`}</h1>
                    </div>
                </Link>
                <Link to='/savedPosts' className='hover:text-white'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-bookmark-fill"></i>
                        </div>
                        <h1>{`Saved Posts: ${user.savedPosts.length}`}</h1>
                    </div>
                </Link>
            </div>

            <div className=' flex flex-col gap-2'>
                <div className='text-xl font-semibold py-1 text-white'>
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
