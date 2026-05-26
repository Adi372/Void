import React from 'react'

const Search = () => {
  return (
    <div className='sticky w-full top-0 z-10 flex items-center justify-end gap-55 px-5'>
        <div className=''>
          <input className='border rounded w-150 py-1 px-2' placeholder='Search...' type="text" />
        </div>
        <div className='text-3xl'>
            <button><i class="ri-notification-2-fill"></i></button>
        </div>
    </div>
  )
}

export default Search
