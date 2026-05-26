import React from 'react'

const AddPost = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
        <div className='border h-fit w-150 rounded flex flex-col p-5 overflow-hidden gap-5'>
            <textarea className='hide-scrollbar border px-5 py-3 rounded h-100 w-full resize-none' placeholder="What's on your mood" type="text" />
            <div className='flex justify-between items-center'>
                <div>
                    <label className='rounded overflow-hidden w-fit px-3 py-1 text-xl border-2'>
                        <i class="ri-image-add-line"></i>
                        <input className='hidden' type="file" accept="image/*" />
                    </label>
                </div>
                <button className='border px-3 py-1 rounded border-2'>Post</button>
            </div>
        </div>
    </div>
  )
}

export default AddPost
