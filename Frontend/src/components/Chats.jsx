import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import gsap from "gsap";

const Chats = ({newMsg, setNewMsg}) => {

    const chatsContainerRef = useRef(null);

    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);

    function allFriends(){
        axios.get('https://void-tup9.onrender.com/api/user/allFriends', 
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            // console.log(res.data);
            setFriends(res.data.friends);
        })
        .catch((err)=>{
            // console.log(err);
        })
    }

    function me(){
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
        });
    }

    function allChats(){
        axios.get('https://void-tup9.onrender.com/api/chat/allRealChats', 
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            // console.log("chats: ", res.data);
            setChats(res.data.chats);
        })
        .catch((err)=>{
            // console.log(err);
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

    useEffect(() => {
        if (!newMsg.length) return;

        const latestMsg = newMsg[newMsg.length - 1];

        setChats(prevChats => {
            const updatedChats = prevChats.map(chat => {
                if (chat._id === latestMsg.chatId) {
                    return {
                        ...chat,
                        lastMessage: latestMsg.message.text,
                        lastMessageSender:
                            latestMsg.message.sender === chat.meId
                                ? chat.me
                                : chat.friendUsername
                    };
                }
                return chat;
            });

            const activeChat = updatedChats.find(
                chat => chat._id === latestMsg.chatId
            );
            const remainingChats = updatedChats.filter(
                chat => chat._id !== latestMsg.chatId
            );

            return activeChat
                ? [activeChat, ...remainingChats]
                : updatedChats;
        });

        setTimeout(() => {
            const el = chatsContainerRef.current;
            if (!el) return;

            gsap.to(el, {
                scrollTop: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        }, 0);

    }, [newMsg]);
    


  return (
    <div className='h-screen'>
        <div className='h-full flex '>
            <div ref={chatsContainerRef} className='w-[30%] border-r-2 border-[#373A43] flex flex-col items-start overflow-y-auto hide-scrollbar'>
                <h1 className='text-2xl text-white font-semibold p-5'>Chats</h1>

                {
                    chats.map((chat)=>(
                        <div key={chat._id} className=' hover:bg-[#1F2128] h-fit w-full flex flex-col gap-4'>
                            <Link to={`/chat/${chat._id}`}>
                            <div className='h-20 flex items-center px-2 gap-4 '>
                                <div className="h-15 w-15 rounded-full overflow-hidden cursor-pointer ml-2">
                                    {!chat?.friendPic ? (
                                    <div className="h-full text-white w-full flex items-center justify-center text-2xl">
                                        <i className="ri-user-line"></i>
                                    </div>
                                    ) : (
                                    <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                                        <img
                                            src={chat.friendPic}
                                            alt="Profile Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    )}
                                </div>
                                <div className='flex flex-col  h-[65%] justify-start items-start'>
                                    <h1 className='font-semibold text-white text-lg'>{chat.friendFullName.firstName}</h1>
                                    <div>
                                        <h1 className='text-sm truncate w-50 text-[#808191] font-semibold'>{chat.lastMessage}</h1>
                                    </div>
                                    
                                </div>
                            </div>
                            </Link>
                        </div>
                    ))
                }
            </div>
            <div className='w-[70%] h-full'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Chats
