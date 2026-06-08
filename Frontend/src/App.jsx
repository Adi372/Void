import { useEffect, useState } from 'react'
import './App.css'
import Routing from './utils/Routing'
import { socket } from './utils/socket'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

function App() {

  const [likeNotification, setLikeNotification] = useState(null);
  const [commentNotification, setCommentNotification] = useState(null);
  const [friendRequestReceivedNotification, setFriendRequestReceivedNotification] = useState(null);
  const [friendRequestAcceptedNotification, setFriendRequestAcceptedNotification] = useState(null);
  const [newMsg, setNewMsg] = useState([]);

  useEffect(()=>{
    const handleNotifitcation = (data) =>{
      console.log("liked-post received", data);
      setLikeNotification(data);
    }
    socket.on("liked-post", handleNotifitcation);
    return()=>{
      socket.off("liked-post", handleNotifitcation);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcation = (data) =>{
       console.log("commented-post received", data);
      setCommentNotification(data);
    }
    socket.on("commented", handleNotifitcation);
    return()=>{
      socket.off("commented", handleNotifitcation);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcation = (data) =>{
      setFriendRequestReceivedNotification(data);
    }
    socket.on("friend-request-received", handleNotifitcation);
    return()=>{
      socket.off("friend-request-received", handleNotifitcation);
    }
  }, []);

  useEffect(()=>{
    const handleNotifitcation = (data) =>{
      setFriendRequestAcceptedNotification(data);
    }
    socket.on("friend-request-accepted", handleNotifitcation);
    return()=>{
      socket.off("friend-request-accepted", handleNotifitcation);
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
    <div className='bg-[#232630]'>
      <Routing 
        likeNotification={likeNotification} 
        setLikeNotification={setLikeNotification} 
        commentNotification={commentNotification} 
        setCommentNotification={setCommentNotification}
        friendRequestReceivedNotification={friendRequestReceivedNotification}
        setFriendRequestReceivedNotification={setFriendRequestReceivedNotification}
        friendRequestAcceptedNotification={friendRequestAcceptedNotification}
        setFriendRequestAcceptedNotification={setFriendRequestAcceptedNotification}
        newMsg={newMsg}
        setNewMsg={setNewMsg}
      />
    </div>
  )
}

export default App
