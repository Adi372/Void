import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Feed from './Feed';

const LikedPosts = () => {

    const [user, setUser] = useState([]);
    const [likedPosts, setlikedPosts] = useState([]);

    function allLikedPosts(){
        axios.get('http://localhost:3000/api/post/likedPosts',
            {withCredentials: true}
        )
        .then((res)=>{
            // console.log(res.data);
            setlikedPosts(res.data.likedPosts);
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    function findUser(){
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            // console.log(res.data)
            setUser(res.data);
        })
        .catch((err)=>{
            // console.log(err);
            setUser(null);
        });
    }

    useEffect(()=>{
        findUser();
    }, []);

    useEffect(()=>{
        allLikedPosts();
    }, [])

    if(!user){
        return <div className='h-full text-[#808191] flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className=' h-screen flex flex-col'>
      <div className=' text-4xl py-10 px-6 flex justify-between text-white'>
        Liked Posts
      </div>
      <div className='px-15 py-5 flex flex-wrap justify-between gap-y-14 overflow-y-auto hide-scrollbar'>
        {
            likedPosts.map((post)=>(
                <Feed index={post._id} key={post._id} user={user} post={post}/>
            ))
        }
      </div>
    </div>
  )
}

export default LikedPosts
