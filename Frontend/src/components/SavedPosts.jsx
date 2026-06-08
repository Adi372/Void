import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Feed from './Feed';

const SavedPosts = () => {

    const [user, setUser] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);

    function findUser(){
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            console.log(res.data)
            setUser(res.data);
        })
        .catch((err)=>{
            console.log(err);
            setUser(null);
        });
    }

    function allSavedPosts(){
        axios.get('http://localhost:3000/api/post/savedPosts',
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setSavedPosts(res.data.savedPosts);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        findUser();
    }, []);

    useEffect(()=>{
        allSavedPosts();
    }, []);

    if(!user){
        return <div className='h-full text-[#808191] flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className=' h-screen flex flex-col'>
      <div className='text-4xl py-10 px-6 flex justify-between text-white'>
        Saved Posts
      </div>
      <div className='px-15 py-5 flex flex-wrap justify-between gap-y-14 overflow-y-auto hide-scrollbar'>
        {
            savedPosts.map((post)=>(
                <Feed index={post._id} key={post._id} user={user} post={post}/>
            ))
        }
      </div>
    </div>
  )
}

export default SavedPosts
