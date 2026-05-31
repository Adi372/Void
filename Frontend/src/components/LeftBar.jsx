import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LeftBar = (
  {
    likeNotifications, 
    setLikeNotifications, 
    commentNotifications, 
    setCommentNotifications, 
    friendRequestReceivedNotifications, 
    setFriendRequestReceivedNotifications, 
    friendRequestAcceptedNotifications, 
    setFriendRequestAcceptedNotifications
  }) => {
  const [notificationsLength, setNotificationsLength] = useState('');
  const location = useLocation();
  console.log(location.pathname);

  useEffect(()=>{
    if(notificationsLength===99){
      return;
    }
    setNotificationsLength(likeNotifications.length + commentNotifications.length + friendRequestReceivedNotifications.length + friendRequestAcceptedNotifications.length);
  }, [likeNotifications, commentNotifications, friendRequestReceivedNotifications, friendRequestAcceptedNotifications])

  console.log('like notifications: ', likeNotifications);
  console.log('comment notifications: ', commentNotifications);
  console.log('Friend requests received notifications: ', friendRequestReceivedNotifications);
  console.log('Friend requests accepted notifications: ', friendRequestAcceptedNotifications);

  useEffect(()=>{
    if(location.pathname === "/notifications/likes"){
      setLikeNotifications([]);
    }
  }, [location.pathname]);

  useEffect(()=>{
    if(location.pathname === "/notifications/comments"){
      setCommentNotifications([]);
    }
  }, [location.pathname]);

  useEffect(()=>{
    if(location.pathname === "/notifications/friends"){
      setFriendRequestReceivedNotifications([]);
      setFriendRequestAcceptedNotifications([]);
    }
  }, [location.pathname]);

  return (
    <div className='h-full w-[100px] border-r flex flex-col py-8 items-center gap-25'>
        <Link to='/' className='text-2xl font-bold w-fit'>Logo</Link>
        <div className=' relative flex flex-col gap-8'>
          <Link to='/notifications/likes' className={`${notificationsLength? "flex":"hidden"} border absolute h-5 w-5 overflow-hidden right-3 top-3 bg-black rounded-full text-2xl flex justify-center items-center`}>
            <h1 className='text-[12px] font-semibold text-white'>{notificationsLength}</h1>
          </Link>
            <Link to='/notifications/likes' className='border w-fit px-4 py-3 rounded-full text-2xl'>
              <div className=''>
                <i class="ri-notification-line"></i>
              </div>
            </Link>
            <Link to='/addPost' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-add-large-line"></i></Link>
            <Link to='/' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-home-line"></i></Link>
            <Link to='/chat' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-mail-line"></i></Link>
            <Link to='/aichat' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-robot-2-line"></i></Link>
            <Link to='/profile' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-user-line"></i></Link>
        </div>
    </div>
  )
}

export default LeftBar
