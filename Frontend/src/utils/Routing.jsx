import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LeftBar from '../components/LeftBar'
import RightBar from '../components/RightBar'
import Home from '../components/Home'
import Register from '../components/Register'
import Login from '../components/Login'
import AddPost from '../components/AddPost'
import Profile from '../components/Profile'
import Chats from '../components/Chats'
import ChatWindow from '../components/ChatWindow'
import AIChat from '../components/AIChat'
import Post from '../components/Post'
import UserProfile from '../components/UserProfile'
import Notifications from '../components/Notifications'
import LikedPosts from '../components/LikedPosts'
import CommentedPosts from '../components/CommentedPosts'
import SavedPosts from '../components/SavedPosts'
import AllFriends from '../components/AllFriends'
import Interests from '../components/Interests'

const Routing = ({
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

  const location = useLocation();
  const bars = location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/interests';

  return (
    <div className='flex h-screen'>
        {
          bars && <LeftBar 
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
        }
        <div className='flex-1'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/addPost' element={<AddPost/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/aichat' element={<AIChat/>}/>
            <Route path='/likedPosts' element={<LikedPosts/>}/>
            <Route path='/commentedPosts' element={<CommentedPosts/>}/>
            <Route path='/savedPosts' element={<SavedPosts/>}/>
            <Route path='/friends' element={<AllFriends/>}/>
            <Route path='interests' element={<Interests/>} />
            <Route path='/notifications' 
            element=
            {<Notifications  
              likeNotification={likeNotification} 
              setLikeNotification={setLikeNotification} 
              commentNotification={commentNotification} 
              setCommentNotification={setCommentNotification} 
              friendRequestReceivedNotification={friendRequestReceivedNotification} 
              setFriendRequestReceivedNotification={setFriendRequestReceivedNotification} 
              friendRequestAcceptedNotification={friendRequestAcceptedNotification} 
              setFriendRequestAcceptedNotification={setFriendRequestAcceptedNotification}
            />}/>

            <Route path='/post/:postId' element={<Post/>}/>
            <Route path='/userProfile/:userId' element={<UserProfile/>}/>
            <Route path='/chat' element={<Chats newMsg={newMsg} setNewMsg={setNewMsg} />}>
              <Route path=':id' element={<ChatWindow/>}/>
            </Route>
          </Routes>
        </div>
        {bars && <RightBar/>}
    </div>
  )
}

export default Routing
