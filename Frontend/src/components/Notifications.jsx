import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom';

const Notifications = () => {

    const [user, setUser] = useState(null);

    const [likeNotifications, setLikeNotifications] = useState([])
    const [commentNotifications, setCommentNotifications] = useState([]);
    const [friendRequestReceivedNotifications, setFriendRequestReceivedNotifications] = useState([]);
    const [friendRequestAcceptedNotifications, setFriendRequestAcceptedNotifications] = useState([]);

    useEffect(()=>{
      axios.get('http://localhost:3000/api/auth/findUser',
          {
              withCredentials: true
          }
      )
      .then((res)=>{
        console.log(res.data)
        setUser(res.data);
        setLikeNotifications(res.data.notifications.likes)
        setCommentNotifications(res.data.notifications.comments)
        setFriendRequestReceivedNotifications(res.data.notifications.friendRequestsReceived);
        setFriendRequestAcceptedNotifications(res.data.notifications.acceptedRequest);
      })
      .catch((err)=>{
          console.log(err);
          setUser(null);
      });
      return () => {
        clearNotifications();
      }
  }, []);

  console.log(likeNotifications)
  console.log(commentNotifications);
  console.log(friendRequestReceivedNotifications);
  console.log(friendRequestAcceptedNotifications);

  function clearNotifications(){
    axios.get('http://localhost:3000/api/user/clearNotifications', 
      {withCredentials: true}
    )
    .then((res)=>{
      console.log(res.data);
      setLikeNotifications([]);
      setCommentNotifications([]);
      setFriendRequestReceivedNotifications([]);
      setFriendRequestAcceptedNotifications([]);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  

  return (
    <div className='h-screen flex flex-col gap-5'>
      <div className='border h-fit w-full flex p-5 items-center'>
        <div className=' w-full flex justify-center'>
          <div className='h-fit w-fit border rounded flex gap-10 text-4xl rounded-4xl px-5 py-4'>
            <Link to='/notifications/likes'>
              <i class="ri-heart-3-line"></i>
            </Link>
            <Link to='/notifications/comments' >
              <i class="ri-chat-1-line"></i>
            </Link>
            <Link to='/notifications/friends' >
              <i class="ri-user-heart-line"></i>
            </Link>
          </div>
        </div>
        {/* <div onClick={clearNotifications} className='border rounded py-2 px-3 text-2xl w-fit'>
          <i class="ri-delete-bin-2-line"></i>
        </div> */}
      </div>

      <div className='border h-fit overflow-y-auto hide-scrollbar'>
        <Outlet context={{likeNotifications, commentNotifications, friendRequestReceivedNotifications, friendRequestAcceptedNotifications}} />
      </div>
    </div>
  )
}

export default Notifications
