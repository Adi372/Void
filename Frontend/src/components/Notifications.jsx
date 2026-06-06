import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Notifications = ({
  likeNotification, 
  setLikeNotification, 
  commentNotification, 
  setCommentNotification, 
  friendRequestReceivedNotification, 
  setFriendRequestReceivedNotification, 
  friendRequestAcceptedNotification, 
  setFriendRequestAcceptedNotification,
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
        console.log("User: ", res.data);
        const likeNotifications = res.data.notifications.likes.map((n) => ({
          postId: n.postId,
          postCaption: n.postCaption,
          userId: n.userId,
          profilePic: n.profilePic,
          username: n.username,
          fullName: n.fullName,
          id: n._id,
          createdAt: n.createdAt,
          type: "like"
        }));

        const commentNotifications = res.data.notifications.comments.map((n) => ({
          postId: n.postId,
          postCaption: n.postCaption,
          userId: n.userId,
          profilePic: n.profilePic,
          username: n.username,
          fullName: n.fullName,
          id: n._id,
          createdAt: n.createdAt,
          type: "comment",
          comment: n.comment
        }));

        const friendRequest = res.data.notifications.friendRequestsReceived.map((f)=>({
          userId: f.userId,
          profilePic: f.profilePic,
          username: f.username,
          fullName: f.fullName,
          id: f._id,
          createdAt: f.createdAt,
          type: "friend-request"
        }))

        const friendAccepted = res.data.notifications.acceptedRequest.map((f)=>({
          userId: f.userId,
          profilePic: f.profilePic,
          username: f.username,
          fullName: f.fullName,
          id: f._id,
          createdAt: f.createdAt,
          type: "friend-accepted"
        }))

        const allNotifications = [
          ...likeNotifications,
          ...commentNotifications,
          ...friendRequest,
          ...friendAccepted
        ];

        allNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(allNotifications);
      })
      .catch((err)=>{
          console.log(err);
          setUser(null);
      });
  }, []);

  useEffect(() => {
    const incoming = [];

    if (likeNotification) {
      console.log(likeNotification)
      incoming.push({...likeNotification,type: "like"});
    }

    if (commentNotification) {
       console.log(commentNotification)
      incoming.push({...commentNotification, type: "comment"});
    }

    if(friendRequestReceivedNotification){
      console.log(friendRequestReceivedNotification);
      incoming.push({...friendRequestReceivedNotification, type: "friend-request"});
    }

    if(friendRequestAcceptedNotification){
      console.log(friendRequestAcceptedNotification);
      incoming.push({...friendRequestAcceptedNotification, type: "friend-accepted"});
    }

    if (incoming.length === 0) return;

    setNotifications(prev => {
      const updated = [...incoming, ...prev];

      return updated.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });

    setLikeNotification('');
    setCommentNotification('');
    setFriendRequestReceivedNotification('');
    setFriendRequestAcceptedNotification('');

  }, [likeNotification, commentNotification, friendRequestReceivedNotification, friendRequestAcceptedNotification]);

  function clearNotifications(){
      axios.get('http://localhost:3000/api/user/clearNotifications',
        {withCredentials: true}
      )
      .then((res)=>{
        console.log(res.data);
        setNotifications([]);
      })
      .catch((err)=>{
        console.log(err);
      })
    }

  console.log("Notifications: ", notifications);

  return (
    <div className='h-screen flex flex-col gap-5'>
      <div className='border text-4xl p-6 flex justify-between'>
        Notifications
        <button onClick={(()=>clearNotifications())} className='text-xl flex items-center border px-2 py-1 rounded gap-1'>
          <i className="ri-delete-bin-2-line"></i>
          <h1 className='font-semibold'>Clear</h1>
        </button>
      </div>
      <div className='border h-full flex flex-col p-5 gap-4 overflow-y-auto hide-scrollbar'>
        {
          notifications.map((n)=>(
            <div key={n.id} className='border rounded p-4 w-fit flex items-center gap-2 '>
              <Link to={`/userProfile/${n.userId}`} className="border h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                  {!n?.profilePic ? (
                  <div className="h-full w-full flex items-center justify-center text-2xl">
                      <i className="ri-user-line"></i>
                  </div>
                  ) : (
                  <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                      <img
                          src={n.profilePic}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                      />
                  </div>
                  )}
              </Link>

              <div className={`${n.type === "like"?"flex":"hidden"}`}>
                <h1>
                  <Link to={`/userProfile/${n.userId}`} className='font-semibold'>{n.username} </Link> 
                  liked your post 
                  <Link to={`/post/${n.postId}`} className='font-semibold'> {n.postCaption}</Link>
                </h1>
              </div>

              <div className={`${n.type === "comment"?"flex":"hidden"}`}>
                <h1>
                  <Link to={`/userProfile/${n.userId}`} className='font-semibold'>{n.username} </Link>
                   commented 
                   <Link to={`/post/${n.postId}`} className='font-semibold'> {n.comment} </Link> 
                    on your post 
                   <Link to={`/post/${n.postId}`} className='font-semibold'> {n.postCaption}</Link>
                </h1>
              </div>

              <Link to={`/userProfile/${n.userId}`} className={`${n.type === "friend-request"?"flex":"hidden"}`}>
                <h1><span className='font-semibold'>{n.username}</span> sent you a friend request</h1>
              </Link>

              <Link to={`/userProfile/${n.userId}`} className={`${n.type === "friend-accepted"?"flex":"hidden"}`}>
                <h1><span className='font-semibold'>{n.username}</span> accepted your friend request</h1>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Notifications
