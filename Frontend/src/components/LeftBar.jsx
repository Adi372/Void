import React from 'react'
import { Link } from 'react-router-dom'

const LeftBar = () => {
  return (
    <div className='h-full w-[100px] border-r flex flex-col py-8 items-center gap-30'>
        <Link to='/' className='text-2xl font-bold w-fit'>Logo</Link>
        <div className='flex flex-col gap-10'>
            <Link to='/addPost' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-add-large-line"></i></Link>
            <Link to='/' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-home-line"></i></Link>
            <button className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-mail-line"></i></button>
            <button className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-robot-2-line"></i></button>
            <Link to='/profile' className='border w-fit px-4 py-3 rounded-full text-2xl'><i class="ri-user-line"></i></Link>
        </div>
    </div>
  )
}

export default LeftBar
