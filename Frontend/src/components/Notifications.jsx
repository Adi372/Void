import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom';

const Notifications = () => {

    const [user, setUser] = useState(null);

    const [likeNotifications, setLikeNotifications] = useState()

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
      })
      .catch((err)=>{
          console.log(err);
          setUser(null);
      });
  }, []);

  console.log(likeNotifications)

  return (
    <div className='h-screen flex flex-col gap-5'>
      <div className='border h-fit w-full flex p-5 justify-center items-center'>
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

      <div className='border h-fit'>
        <Outlet context={{likeNotifications}} />
      </div>
    </div>
  )
}

export default Notifications
