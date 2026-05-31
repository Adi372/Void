import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

const Chats = () => {

    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);

    function allFriends(){
        axios.get('http://localhost:3000/api/user/allFriends', 
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            console.log(res.data);
            setFriends(res.data.friends);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function me(){
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
    }

    function allChats(){
        axios.get('http://localhost:3000/api/chat/allChats', 
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            console.log(res.data);
            setChats(res.data.chats);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        me();
    }, []);

    useEffect(()=>{
        allFriends();
    }, []);

    useEffect(()=>{
        allChats();
    },[])

  return (
    <div className='h-screen'>
        <div className='h-full flex '>
            <div className='w-[30%] border flex flex-col p-5 gap-5 overflow-y-auto hide-scrollbar'>
                <div className='sticky top-0 z-10'>
                    <input className=' h-full w-full border rounded px-3 py-2' placeholder='Search...' type="text" />
                </div>

                {
                    chats.map((chat)=>(
                        <div key={chat._id} className='h-fit flex flex-col gap-4'>
                            <Link to={`/chat/${chat._id}`}>
                            <div className='rounded border h-20 flex items-center px-2 gap-4'>
                                <div className='h-15 w-15 rounded-full border flex justify-center items-center'>
                                    <i class="ri-user-line"></i>
                                </div>
                                <div className='flex flex-col  h-[65%] justify-start items-start'>
                                    <h1 className='font-semibold  text-lg'>{chat.friendFullName.firstName}</h1>
                                    <div>
                                        <h1 className='text-sm'>{chat.lastMessage}</h1>
                                    </div>
                                    
                                </div>
                            </div>
                            </Link>
                        </div>
                    ))
                }
            </div>
            <div className='w-[70%] border h-full'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Chats
