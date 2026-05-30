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
import LikeNotifications from '../components/LikeNotifications'
import CommentNotifications from '../components/CommentNotifications'
import FriendNotifications from '../components/FriendNotifications'

const Routing = () => {

  const location = useLocation();
  const bars = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className='flex h-screen'>
        {bars && <LeftBar/>}
        <div className='flex-1'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/addPost' element={<AddPost/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/aichat' element={<AIChat/>}/>
            <Route path='/notifications' element={<Notifications/>}>
              <Route path='/notifications/likes' element={<LikeNotifications/>}/>
              <Route path='/notifications/comments' element={<CommentNotifications/>}/>
              <Route path='/notifications/friends' element={<FriendNotifications/>}/>
            </Route>
            <Route path='/post/:postId' element={<Post/>}/>
            <Route path='/userProfile/:userId' element={<UserProfile/>}/>
            <Route path='/chat' element={<Chats/>}>
              <Route path=':id' element={<ChatWindow/>}/>
            </Route>
          </Routes>
        </div>
        {bars && <RightBar/>}
    </div>
  )
}

export default Routing
