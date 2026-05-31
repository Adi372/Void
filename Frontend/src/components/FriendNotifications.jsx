import React from 'react'
import { useOutletContext } from 'react-router-dom'

const FriendNotifications = () => {
  const {friendRequestReceivedNotifications, friendRequestAcceptedNotifications} = useOutletContext();
  return (
    <div className='h-full p-5 flex gap-3'>
      <div className={` ${friendRequestReceivedNotifications.length>0? 'flex':'hidden'} w-[50%] h-full p-5 flex flex-col gap-3 border`}>
        {
          friendRequestReceivedNotifications?.map((f) => (
            <div key={f._id} className='border rounded-md px-5 py-4 h-fit w-fit'>
              <div className='flex items-center gap-3'>
                <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
                  <i className="ri-user-line"></i>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='flex flex-col'>
                    <h1 className='font-semibold'>{f.username}</h1>
                    <h1>
                      {f.fullName.firstName} {f.fullName.lastName}
                    </h1>
                  </div>
                  <h1>Sent you a friend Request</h1>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className={` ${friendRequestAcceptedNotifications.length>0? 'flex':'hidden'} w-[50%] h-full p-5 flex flex-col gap-3 border`}>
        {
          friendRequestAcceptedNotifications?.map((f) => (
            <div key={f._id} className='border rounded-md px-5 py-4 h-fit w-fit'>
              <div className='flex items-center gap-3'>
                <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
                  <i className="ri-user-line"></i>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='flex flex-col'>
                    <h1 className='font-semibold'>{f.username}</h1>
                    <h1>
                      {f.fullName.firstName} {f.fullName.lastName}
                    </h1>
                  </div>
                  <h1>accepted your friend Request</h1>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FriendNotifications
