import React from 'react'
import { useOutletContext } from 'react-router-dom'

const LikeNotifications = () => {
  const {likeNotifications} = useOutletContext();
  return (
    <div className='h-full p-5 flex flex-col gap-3'>
      {
        likeNotifications?.map((l)=>(
          <div key={l._id} className=' border rounded-md px-5 py-4 h-fit w-fit'>
            <div className='flex items-center gap-3'>
              <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
                <i class="ri-user-line"></i>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex flex-col'>
                  <h1 className='font-semibold'>{l.username}</h1>
                  <h1>{l.fullName.firstName} {l.fullName.lastName}</h1>
                </div>
                <div className='gap-2 flex items-center'>
                  <h1>liked you post </h1>
                  <h1 className='font-semibold'>{l.postCaption}</h1>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default LikeNotifications
