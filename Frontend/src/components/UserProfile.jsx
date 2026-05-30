import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Feed from './Feed';

const UserProfile = () => {

    const [users, setUsers] = useState([]);
    const {userId} = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
      axios.get('http://localhost:3000/api/user/allUsers',
          {
              withCredentials: true
          }
      )
      .then((res)=>{
          setUsers(res.data.users);
      })
      .catch((err)=>{
          console.log(err);
      });
    }, []);

    function getPosts(userId){
        axios.post('http://localhost:3000/api/post/userPosts',
            {
                userId
            },
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            console.log(res.data.posts);
            setPosts(res.data.posts)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getPosts(userId);
    },[]);

    const currentUser = users.find(u => u._id === userId);

    if(!users.length){
        return <div className='h-full flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className='h-screen overflow-y-auto hide-scrollbar'>
        {
            currentUser ? (
                <div className='w-full flex flex-col'>
                    <div className='flex  h-50 items-center gap-10 px-5 w-full justify-center'>
                        <div className='border h-40 w-40 rounded-full flex items-center justify-center text-[170px] overflow-hidden'>
                            <i class="ri-user-line"></i>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-4xl font-bold'>{currentUser.username}</h1>
                            <h1 className='text-xl font-semibold'>{`${currentUser.fullName.firstName} ${currentUser.fullName.lastName}`}</h1>
                            <div className='flex gap-5'>
                                <h1 className='text-xl font-semibold'>{`${currentUser.createdPosts.length} posts`}</h1>
                                <h1 className='text-xl font-semibold'>{`${currentUser.friends.length} friends`}</h1>
                            </div>
                        </div>
                    </div>
                    <div className=' items-center h-15 flex justify-center gap-10'>
                        <button className='border rounded h-fit w-fit py-2 px-3'>Add Friend</button>
                        <button className='border rounded h-fit w-fit py-2 px-3'>Message</button>
                    </div>
                    <div className=' mt-10 px-15'>
                        <div className='flex flex-wrap py-3 justify-between gap-y-10'>
                            {
                                posts.map((post, index)=>(
                                    <Feed key={post._id} post={post} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            ):
            (
                <div>User not found</div>
            )
        }
    </div>
  )
}

export default UserProfile
