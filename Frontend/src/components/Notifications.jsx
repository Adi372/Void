import axios from 'axios';
import React, { useEffect, useState } from 'react'

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
      })
      .catch((err)=>{
          console.log(err);
          setUser(null);
      });
  }, []);

  return (
    <div className='h-screen'>
      
    </div>
  )
}

export default Notifications
