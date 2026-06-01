import { useEffect, useState } from 'react'
import './App.css'
import Routing from './utils/Routing'
import { socket } from './utils/socket'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

function App() {

  const [likeNotifications, setLikeNotifications] = useState([]);
  const [commentNotifications, setCommentNotifications] = useState([]);
  const [friendRequestReceivedNotifications, setFriendRequestReceivedNotifications] = useState([]);
  const [friendRequestAcceptedNotifications, setFriendRequestAcceptedNotifications] = useState([]);
  const [user, setUser] = useState(null);

  const [newMsg, setNewMsg] = useState([]);

  useEffect(()=>{
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            setUser(res.data);
            setLikeNotifications(res.data.notifications.likes);
            setCommentNotifications(res.data.notifications.comments);
            setFriendRequestReceivedNotifications(res.data.notifications.friendRequestsReceived);
            setFriendRequestAcceptedNotifications(res.data.notifications.acceptedRequest);
        })
        .catch((err)=>{
            console.log(err);
            setUser(null);
        });
    }, []);

  useEffect(()=>{
    const handleNotifitcations = (data) =>{
      setLikeNotifications(prev => [...prev, data]);
    }
    socket.on("liked-post", handleNotifitcations);
    return()=>{
      socket.off("liked-post", handleNotifitcations);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcations = (data) =>{
      setCommentNotifications(prev => [...prev, data]);
    }
    socket.on("commented", handleNotifitcations);
    return()=>{
      socket.off("commented", handleNotifitcations);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcations = (data) =>{
      setFriendRequestReceivedNotifications(prev => [...prev, data]);
    }
    socket.on("friend-request-received", handleNotifitcations);
    return()=>{
      socket.off("friend-request-received", handleNotifitcations);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcations = (data) =>{
      setFriendRequestAcceptedNotifications(prev => [...prev, data]);
    }
    socket.on("friend-request-accepted", handleNotifitcations);
    return()=>{
      socket.off("friend-request-accepted", handleNotifitcations);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcations = (data) =>{

      setNewMsg(prev => [...prev, data]);
    }
    socket.on("new-message-notification", handleNotifitcations);
    return()=>{
      socket.off("new-message-notification", handleNotifitcations);
    }
  }, []);

  return (
    <div>
      <Routing 
        likeNotifications={likeNotifications} 
        setLikeNotifications={setLikeNotifications} 
        commentNotifications={commentNotifications} 
        setCommentNotifications={setCommentNotifications}
        friendRequestReceivedNotifications={friendRequestReceivedNotifications}
        setFriendRequestReceivedNotifications={setFriendRequestReceivedNotifications}
        friendRequestAcceptedNotifications={friendRequestAcceptedNotifications}
        setFriendRequestAcceptedNotifications={setFriendRequestAcceptedNotifications}
        newMsg={newMsg}
        setNewMsg={setNewMsg}
      />
    </div>
  )
}

export default App
