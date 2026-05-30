import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Chats = () => {
  return (
    <div className='h-screen'>
        <div className='h-full flex '>
            <div className='w-[30%] border flex flex-col p-5 gap-5 overflow-y-auto hide-scrollbar'>
                <div className='sticky top-0 z-10'>
                    <input className=' h-full w-full border rounded px-3 py-2' placeholder='Search...' type="text" />
                </div>

                <div className='h-full flex flex-col gap-4'>
                    <Link to={`/chat/1`}>
                    <div className='rounded border h-20 flex items-center px-2 gap-4'>
                        <div className='h-15 w-15 rounded-full border flex justify-center items-center'>
                            <i class="ri-user-line"></i>
                        </div>
                        <div className='flex flex-col justify-center'>
                            <h1 className='font-semibold text-lg'>Name</h1>
                            <h1 className='text-sm'>Last Message....</h1>
                        </div>
                    </div>
                    </Link>
                </div>
            </div>
            <div className='w-[70%] border h-full'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Chats
