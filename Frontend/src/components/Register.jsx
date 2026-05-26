import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className='h-screen flex justify-center py-10'>
        <div className='h-full rounded w-120 border flex flex-col items-center px-10 py-5 gap-10'>
            <div className='text-3xl font-semibold mt-25 mb-10'>
                <h1>Platform Name</h1>
            </div>
            <div className='flex flex-col gap-2 w-80'>
                <input className='border rounded px-3 py-2' placeholder='email' type="text" />
                <input className='border rounded px-3 py-2' placeholder='password' type="text" />
            </div>
            <button className='w-80 px-3 py-2 font-semibold border rounded'>Register</button>
            <div className='flex gap-2 w-full justify-center border-t py-3 mt-auto'>
                <h1>Already have an account?</h1>
                <Link to='/login' className=' font-semibold'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Register
