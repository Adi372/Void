import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LeftBar from '../components/LeftBar'
import RightBar from '../components/RightBar'
import Home from '../components/Home'
import Register from '../components/Register'
import Login from '../components/Login'
import AddPost from '../components/AddPost'
import Profile from '../components/Profile'

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
          </Routes>
        </div>
        {bars && <RightBar/>}
    </div>
  )
}

export default Routing
