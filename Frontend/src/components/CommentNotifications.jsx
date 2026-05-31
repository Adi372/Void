import React from 'react'
import { useOutletContext } from 'react-router-dom'

const CommentNotifications = () => {
  const {commentNotifications} = useOutletContext();

  return (
    <div className='h-full p-5 flex flex-col gap-3'>
      {
        commentNotifications?.map((c)=>(
          <div key={c._id} className=' border rounded-md px-5 py-4 h-fit w-fit'>
            <div className='flex items-center gap-3'>
              <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
                <i class="ri-user-line"></i>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex flex-col'>
                  <h1 className='font-semibold'>{c.username}</h1>
                  <h1>{c.fullName.firstName} {c.fullName.lastName}</h1>
                </div>
                <div className='gap-1.5 flex items-center'>
                  <h1>commented <span className='font-semibold'>{c.comment}</span> your post </h1>
                  <h1 className='font-semibold'>{c.postCaption}</h1>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default CommentNotifications
