import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Notifications = ({
  likeNotifications, 
  setLikeNotifications, 
  commentNotifications, 
  setCommentNotifications, 
  friendRequestReceivedNotifications, 
  setFriendRequestReceivedNotifications, 
  friendRequestAcceptedNotifications, 
  setFriendRequestAcceptedNotifications,
}) => {

    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(()=>{
      axios.get('http://localhost:3000/api/auth/findUser',
          {
              withCredentials: true
          }
      )
      .then((res) => {
        console.log(res.data);
        const likeNotifications = res.data.notifications.likes.map((n) => ({
          postId: n.postId,
          postCaption: n.postCaption,
          userId: n.userId,
          username: n.username,
          fullName: n.fullName,
          id: n._id,
          type: "like"
        }));

        const commentNotifications = res.data.notifications.comments.map((n) => ({
          postId: n.postId,
          postCaption: n.postCaption,
          userId: n.userId,
          username: n.username,
          fullName: n.fullName,
          id: n._id,
          type: "comment",
          comment: n.comment
        }));

        setNotifications([
          ...likeNotifications,
          ...commentNotifications
        ]);
      })
      .catch((err)=>{
          console.log(err);
          setUser(null);
      });
  }, []);

  useEffect(()=>{
    console.log("Like Notifications: ", likeNotifications);
  }, [likeNotifications]);

  useEffect(()=>{
    console.log("Like Notifications: ", commentNotifications)
  }, [commentNotifications]);

  console.log("Notifications: ", notifications)


  return (
    <div className='h-screen flex flex-col gap-5'>
      <div className='border text-4xl p-6'>
        Notifications
      </div>
      <div className='border h-full flex flex-col p-5 gap-4 overflow-y-auto hide-scrollbar'>
        {
          notifications.map((n)=>(
            <div key={n.id} index={n.id}  className='border rounded p-4 w-fit flex items-center gap-2 '>
              <div className='border h-10 w-10 rounded-full flex gap-2 justify-center items-center'>
                <i class="ri-user-line"></i>
              </div>
              <div className={`${n.type === "like"?"flex":"hidden"}`}>
                <h1><span className='font-semibold'>{n.username}</span> liked your post <span className='font-semibold'>{n.postCaption}</span></h1>
              </div>
              <div className={`${n.type === "comment"?"flex":"hidden"}`}>
                <h1><span className='font-semibold'>{n.username}</span> commented <span className='font-semibold'>{n.comment}</span> on your post <span className='font-semibold'>{n.postCaption}</span></h1>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Notifications
