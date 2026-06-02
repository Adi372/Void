import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

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

  const [msgNotificationLength, setMsgNotificationLength] = useState('');
  const [notificationsLength, setNotificationsLength] = useState(0);
  const location = useLocation();
  console.log(location.pathname);

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
    <div className='h-full w-[100px] border-r flex flex-col py-8 items-center gap-25'>
        <Link to='/' className='text-2xl font-bold w-fit'>Logo</Link>
        <div className=' relative flex flex-col gap-8'>

          <Link to='/notifications' className={`${notificationsLength && !location.pathname.startsWith("/notifications")? "flex":"hidden"} border absolute h-5 w-5 overflow-hidden right-3 top-3 bg-black rounded-full text-2xl flex justify-center items-center`}>
            <h1 className='text-[12px] font-semibold text-white'>{notificationsLength}</h1>
          </Link>

            <Link to='/notifications' className='border w-fit px-4 py-3 rounded-full text-2xl'>
              <div className=''>
                <i class="ri-notification-line"></i>
              </div>
            </Link>

            <Link to='/addPost' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-add-large-line"></i></Link>
            <Link to='/' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-home-line"></i></Link>

            <Link to='/chat' className={`${msgNotificationLength && !location.pathname.startsWith("/chat")? "flex":"hidden"} border absolute h-5 w-5 overflow-hidden right-2.5 top-72 bg-black rounded-full text-2xl flex justify-center items-center`}>
              <h1 className='text-[12px] font-semibold text-white'>{msgNotificationLength}</h1>
            </Link>

            <Link to='/chat' className='border w-fit px-4 py-3 rounded-full text-2xl'>
              <i class="ri-mail-line"></i>
            </Link>

            <Link to='/aichat' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-robot-2-line"></i></Link>
            <Link to='/profile' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-user-line"></i></Link>
        </div>
    </div>
  )
}

export default LeftBar
