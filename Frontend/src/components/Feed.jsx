import React from 'react'

const Feed = () => {
  return (
    <div className='flex gap-20'>
            <div className='w-120 h-140 overflow-hidden border rounded-md flex flex-col'>
                <div className='flex py-3 px-4 items-center gap-2 border-b'>
                    <div className='border h-10 w-10 rounded-full flex items-center justify-center '>
                        <i class="ri-user-line"></i>
                    </div>
                    <h1 className='font-semibold'>Username</h1>
                </div>
                <div className='flex flex-col'>
                    <div className='h-100 border-b'></div>
                    <div className='border-b py-3 px-4 font-semibold'>
                        <h1>caption...</h1>
                    </div>
                    <div className='flex justify-between px-4 py-2'>
                        <div className='flex items-center gap-1 text-2xl'>
                            <i class="ri-heart-3-line"></i>
                            <h1 className='text-sm font-semibold'>100</h1>
                        </div>
                        <div className='flex items-center gap-1 text-2xl'>
                            <i class="ri-chat-1-line"></i>
                            <h1 className='text-sm font-semibold'>100</h1>
                        </div>
                        <div className='flex items-center gap-1 text-2xl'>
                            <i class="ri-share-line"></i>
                            <h1 className='text-sm font-semibold'>100</h1>
                        </div>
                        <div className='flex items-center gap-1 text-2xl'>
                            <i class="ri-bookmark-line"></i>
                            <h1 className='text-sm font-semibold'>100</h1>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
  )
}

export default Feed
