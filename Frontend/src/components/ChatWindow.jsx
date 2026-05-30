import React from 'react'

const ChatWindow = () => {
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='border w-full h-[12%] flex items-center px-5 gap-4'>
        <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
          <i class="ri-user-line"></i>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-semibold text-lg'>Full Name</h1>
            <h1 className='text-sm'>Username</h1>
        </div>
      </div>

      <div className='border h-[76%] flex flex-col px-5 py-5 overflow-y-auto hide-scrollbar gap-5'>

        <div className='flex gap-3 items-center w-fit max-w-[45%] break-all'>
          <div className='border h-10 w-10 rounded-full flex justify-center items-center self-start shrink-0'>
            <i class="ri-user-line"></i>
          </div>
          <div className='border px-2 py-1 rounded h-fit w-fit'>
            Hi this is Arya
          </div>
        </div>

        <div className='flex gap-3 items-center w-fit max-w-[45%] break-all self-end'>
          <div className='border px-2 py-1 rounded h-fit w-fit'>
            Hi this is Zuva
          </div>
          <div className='border h-10 w-10 rounded-full flex justify-center items-center self-start shrink-0'>
            <i class="ri-user-line"></i>
          </div>
        </div>
      </div>

      <div className='border h-[12%] flex items-center px-5 gap-2'>
        <input className='border rounded w-[93%] h-12 py-2 px-3' placeholder='Message...' type="text" />
        <button className='border flex items-center h-12 text-2xl w-[7%] rounded justify-center'><i class="ri-send-plane-2-line"></i></button>
      </div>
    </div>
  )
}

export default ChatWindow
