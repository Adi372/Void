import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import VoidLogo from '../assets/VoidLogo.png'
import Void from '../assets/Void.png'


const LeftBar = (
  {
    likeNotification, 
    setLikeNotification, 
    commentNotification, 
    setCommentNotification, 
    friendRequestReceivedNotification, 
    setFriendRequestReceivedNotification, 
    friendRequestAcceptedNotification, 
    setFriendRequestAcceptedNotification,
    newMsg,
    setNewMsg
  }) => {

    const [user, setUser] = useState(null);

  const [msgNotificationLength, setMsgNotificationLength] = useState('');
  const [notificationsLength, setNotificationsLength] = useState(0);
  const location = useLocation();
  console.log(location.pathname);

  useEffect(()=>{
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
    }, []);

  useEffect(() => {
  if (likeNotification) {
    setNotificationsLength(prev => Math.min(prev + 1, 99));
  }
}, [likeNotification]);

useEffect(() => {
  if (commentNotification) {
    setNotificationsLength(prev => Math.min(prev + 1, 99));
  }
}, [commentNotification]);

useEffect(() => {
  if (friendRequestReceivedNotification) {
    setNotificationsLength(prev => Math.min(prev + 1, 99));
  }
}, [friendRequestReceivedNotification]);

useEffect(() => {
  if (friendRequestAcceptedNotification) {
    setNotificationsLength(prev => Math.min(prev + 1, 99));
  }
}, [friendRequestAcceptedNotification]);

  useEffect(() => {
    setMsgNotificationLength(Math.min(newMsg.length, 99));
    console.log('Msg Notifications: ', newMsg);
  }, [newMsg]);
  

  console.log('like notifications: ', likeNotification);
  console.log('comment notifications: ', commentNotification);
  console.log('Friend requests received notifications: ', friendRequestReceivedNotification);
  console.log('Friend requests accepted notifications: ', friendRequestAcceptedNotification);


    const prevPath = useRef(location.pathname);

    useEffect(() => {
      const wasInChat = prevPath.current.startsWith("/chat");
      const nowInChat = location.pathname.startsWith("/chat");

      if (wasInChat && !nowInChat) {
        setNewMsg([]);
      }

      const wasInNotifications = prevPath.current.startsWith("/notifications");
      const nowInNotifications = location.pathname.startsWith("/notifications");

      if (wasInNotifications && !nowInNotifications) {
        setLikeNotification('');
        setCommentNotification('');
        setFriendRequestReceivedNotification('');
        setFriendRequestAcceptedNotification('');
        setNotificationsLength(0);
      }

      prevPath.current = location.pathname;
    }, [location.pathname]);


  return (
    <div className='h-full border-r-2 border-[#373A43] w-[100px] bg-[#232630] text-white flex flex-col py-8 items-center gap-20'>
        <Link to='/' className='text-2xl font-bold w-fit'>
          <div className='h-full w-10 mt-5'>
            <img src={VoidLogo} alt="" />
          </div>
        </Link>
        <div className=' relative flex flex-col gap-8'>

          <Link to='/notifications' className={`${notificationsLength && !location.pathname.startsWith("/notifications")? "flex":"hidden"} absolute h-5 w-5 overflow-hidden right-3 top-3 bg-[#6B5DD3] rounded-full text-2xl flex justify-center items-center`}>
            <h1 className='text-[12px] font-semibold text-white'>{notificationsLength}</h1>
          </Link>

            <Link to='/notifications' className={`hover:text-white ${location.pathname.startsWith('/notifications')? "text-white bg-[#6B5DD3] hover:text-white":"text-[#808191]"} w-fit px-4 py-3 rounded-full text-2xl`}>
              <div className=''>
                <i class="ri-notification-line"></i>
              </div>
            </Link>

            <Link to='/addPost' className={`hover:text-white ${location.pathname.startsWith('/addPost')? "text-white bg-[#6B5DD3] hover:text-white":"text-[#808191]"} w-fit px-4 py-3 rounded-full text-2xl`}><i class="ri-add-large-line"></i></Link>
            <Link to='/' className={`hover:text-white ${location.pathname === '/' ? "text-white bg-[#6B5DD3] hover:text-white":"text-[#808191]"} w-fit px-4 py-3 rounded-full text-2xl`}><i class="ri-home-line"></i></Link>

            <Link to='/chat' className={`${msgNotificationLength && !location.pathname.startsWith("/chat")? "flex":"hidden"} absolute h-5 w-5 overflow-hidden right-2.5 top-70 bg-[#6B5DD3] rounded-full text-2xl flex justify-center items-center`}>
              <h1 className='text-[12px] font-semibold text-white'>{msgNotificationLength}</h1>
            </Link>

            <Link to='/chat' className={`hover:text-white ${location.pathname.startsWith('/chat') ? "text-white bg-[#6B5DD3] hover:text-white":"text-[#808191]"} w-fit px-4 py-3 rounded-full text-2xl`}>
              <i class="ri-mail-line"></i>
            </Link>

            <Link to='/aichat' className={`hover:text-white ${location.pathname.startsWith('/aichat') ? "text-white bg-[#6B5DD3] hover:text-white":"text-[#808191]"} w-fit px-4 py-3 rounded-full text-2xl`}><i class="ri-robot-2-line"></i></Link>
            <Link to='/profile' className={` ${location.pathname.startsWith('/profile') ? " border-2 border-[#6B5DD3]":"hover:border-white hover:border-2"} h-14.5 w-14.5 rounded-full overflow-hidden cursor-pointer`}>
                {!user?.profilePic ? (
                <div className="h-full w-full flex items-center justify-center text-2xl">
                    <i className="ri-user-line"></i>
                </div>
                ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                    <img
                        src={user.profilePic}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                    />
                </div>
                )}
            </Link>
        </div>
    </div>
  )
}

export default LeftBar
