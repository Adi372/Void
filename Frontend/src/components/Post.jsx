import React, { useEffect, useState } from 'react'
import Feed from './Feed'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Post = () => {

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const {postId} = useParams();

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
        //   console.log(err);
          setUser(null);
      });
    }, []);

    useEffect(()=>{
      axios.get('https://void-tup9.onrender.com/api/post/allPosts',
          {
              withCredentials: true
          }
      )
      .then((res)=>{
        //   console.log(res.data);
          setPosts(res.data.posts)
      })
      .catch((err)=>{
        //   console.log(err)
      })
    },[]);

    if (posts.length === 0) {
        return <div>Loading...</div>;
    }
  
    const currentPost = posts.find(post => post._id === postId);

  return (
    <div className='h-screen flex items-center justify-center'>
        {
            currentPost ? (
                <Feed post={currentPost} user={user}/>
            ):
            (
                <div>Post not found</div>
            )
        }
    </div>
  )
}

export default Post
