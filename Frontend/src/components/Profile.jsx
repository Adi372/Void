import React from 'react'
import Feed from './Feed'
import { Link } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='h-screen p-5 overflow-y-auto hide-scrollbar'>
        <div className=' p-7 flex flex-col gap-5'>
            <div>
                <div className=' h-10 flex py-2 px-1 items-center gap-5'>
                    <button className='ml-auto border rounded py-1 px-2'><i class="ri-logout-box-r-line"></i></button>
                </div>
                <div className='flex  h-50 items-center gap-20'>
                    <div className='border h-40 w-40 rounded-full flex items-center justify-center text-[170px] overflow-hidden'>
                        <i class="ri-user-line"></i>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-4xl font-bold'>Username</h1>
                        <h1 className='text-2xl font-semibold'>Full Name</h1>
                        <div className='flex font-semibold gap-12'>
                            <div className='flex gap-1'>
                                <i class="ri-sticky-note-fill"></i>
                                <h1>5 posts</h1>
                            </div>
                            <div className='flex gap-1'>
                                <i class="ri-user-heart-fill"></i>
                                <h1>10 friends</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' h-10 flex py-2 px-5 items-center gap-5'>
                    <button className='border rounded py-1 px-2 gap-2 flex'>
                        <i class="ri-pencil-fill"></i>
                        <h1 className='font-semibold'>Edit Profile</h1>
                    </button>
                </div>   
            </div>

            <div className=' flex p-1 gap-2 font-semibold justify-between'>
                <Link>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-heart-3-fill"></i>
                        </div>
                        <h1>Liked Posts: 100</h1>
                    </div>
                </Link>
                <Link>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-chat-1-fill"></i>
                        </div>
                        <h1>Commented Posts: 100</h1>
                    </div>
                </Link>
                <Link>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-bookmark-fill"></i>
                        </div>
                        <h1>Saved Posts: 100</h1>
                    </div>
                </Link>
                <Link>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-share-fill"></i>
                        </div>
                        <h1>Shared Posts: 100</h1>
                    </div>
                </Link>
                <Link>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl'>
                            <i class="ri-prohibited-line"></i>
                        </div>
                        <h1>Blocked Users: 100</h1>
                    </div>
                </Link>
            </div>

            <div className=' flex flex-col gap-2'>
                <div className='text-xl font-semibold py-1'>
                    <h1>Your Posts</h1>
                </div>
                <div className='flex flex-wrap py-3 justify-between gap-y-10'>
                    <Feed />
                    <Feed/>
                    <Feed/>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Profile
