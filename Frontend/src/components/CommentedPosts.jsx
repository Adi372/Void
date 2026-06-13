import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Feed from './Feed';

const CommentedPosts = () => {

    const [user, setUser] = useState([]);
    const [commentedPosts, setCommentedPosts] = useState([]);

    function allCommentedPosts(){
        axios.get('http://localhost:3000/api/post/commentedPosts',
            {withCredentials: true}
        )
        .then((res)=>{
            // console.log(res.data);
            setCommentedPosts(res.data.commentedPosts);
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
        allCommentedPosts();
    }, []);

    useEffect(()=>{
        findUser();
    }, []);

    if(!user){
        return <div className='h-full text-[#808191] flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className=' h-screen flex flex-col'>
      <div className='text-4xl py-10 px-6 flex justify-between text-white'>
        Commented Posts
      </div>
      <div className='px-15 py-5 flex flex-wrap justify-between gap-y-14 overflow-y-auto hide-scrollbar'>
        {
            commentedPosts.map((post)=>(
                <Feed index={post._id} key={post._id} user={user} post={post}/>
            ))
        }
      </div>
    </div>
  )
}

export default CommentedPosts
