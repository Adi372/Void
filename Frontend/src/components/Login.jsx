import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {socket} from '../utils/socket'
import VoidFull from '../assets/VoidFull.png'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!email || !password){
            return alert("Please fill all fields");
        }
        axios.post('https://void-tup9.onrender.com/api/auth/login',
            {
                email,
                password
            },
            {withCredentials: true}
        )
        .then((res)=>{
            setUserDetails(res.data);
            socket.disconnect().connect();
            navigate('/profile');
            // console.log(res.data)
        })
        .catch((err)=>{
            if(err.response?.status === 401){
              alert("Wrong Email or Password");
            }
            if(err.response?.status === 500){
              alert("Internal Server Error");
            }
            // console.log(err)
        })
        console.log(userDetails)
    }

  return (
    <div className='h-screen flex justify-center py-10'>
        <div className='h-full rounded w-120 bg-[#1F2128] rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col items-center px-10 py-5 gap-10'>
            <div className='text-3xl font-semibold mt-25 mb-10 text-white'>
                <div className='h-35 w-full'>
                    <img src={VoidFull} className='h-full w-full object-cover' alt="" />
                </div>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-80'>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded px-3 py-2' placeholder='email' type="text" />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded px-3 py-2' placeholder='password' type="text" />
                <button type='submit' className='w-80 rounded-xl font-semibold px-8 py-3 hover:bg-[#4F3ECA] bg-[#6B5DD3] text-white mt-10'>Login</button>
            </form>
            <div className='flex gap-2 w-full text-[#808191] justify-center border-t-2 border-[#373A43] py-3 mt-auto'>
                <h1>Don't have an account?</h1>
                <Link to='/register' className='font-semibold text-white'>Register</Link>
            </div>
        </div>
    </div>
  )
}

export default Login
