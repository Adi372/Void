import React from 'react'
import { Link } from 'react-router-dom'

const LeftBar = () => {
  return (
    <div className='h-full w-[100px] border-r flex flex-col py-8 items-center gap-25'>
        <Link to='/' className='text-2xl font-bold w-fit'>Logo</Link>
        <div className=' flex flex-col gap-8'>
            <Link to='/notifications/likes' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-notification-line"></i></Link>
            <Link to='/addPost' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-add-large-line"></i></Link>
            <Link to='/' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-home-line"></i></Link>
            <Link to='/chat' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-mail-line"></i></Link>
            <Link to='/aichat' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-robot-2-line"></i></Link>
            <Link to='/profile' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-user-line"></i></Link>
        </div>
    </div>
  )
}

export default LeftBar
