import React from 'react'
import Feed from './Feed'
import Search from './Search'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

const Home = () => {

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

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
        //   console.log(err);
          setUser(null);
      });
  }, []);

  useEffect(()=>{
      axios.get('http://localhost:3000/api/post/allPosts',
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

//   console.log(user)


  return (
    <div className='h-screen items-center py-5 overflow-y-auto hide-scrollbar flex flex-col gap-20'>
        <Search/>
        {
            posts.map((post, index)=>(
                <Feed user={user} index={post._id} key={post._id} post={post} />
            ))
        }
    </div>
  )
}

export default Home
