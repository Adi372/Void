import React from 'react'

const RightBar = () => {
  return (
    <div className='h-full w-[300px] border-l flex flex-col py-5 px-10 self-end gap-5'>
        <h1 className='font-semibold text-xl'>Suggested for you</h1>
        <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-3'>
              <div className='border h-10 w-10 rounded-full flex justify-center items-center'>
                <i class="ri-user-line"></i>
              </div>
              <h1>Username</h1>
            </div>

            <div className='flex items-center gap-3'>
              <div className='border h-10 w-10 rounded-full flex justify-center items-center'>
                <i class="ri-user-line"></i>
              </div>
              <h1>Username</h1>
            </div>
        </div>
    </div>
  )
}

export default RightBar
