import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {socket} from '../utils/socket'
import VoidFull from '../assets/VoidFull.png'

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [username, setUsername] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!email || !password || !username){
            return alert("Please fill all fields");
        }
        axios.post('http://localhost:3000/api/auth/register',
            {
                fullName:{
                    firstName,
                    lastName
                },
                username,
                email,
                password
            },
            {withCredentials: true}
        )
        .then((res)=>{
            setUserDetails(res.data);
            socket.disconnect().connect();
            navigate('/interests')
        })
        .catch((err)=>{
            if(err.response?.status === 409){
              alert("Email or Username already exists");
            }
            if(err.response?.status === 500){
              alert("Internal Server Error");
            }
            console.log(err)
            // console.log(err)
        })
        // console.log(userDetails);
    }

  return (
    <div className='h-screen flex justify-center py-10'>
        <div className='h-full rounded w-120 bg-[#1F2128] rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col items-center px-10 py-5 gap-5'>
            <div className='text-white text-3xl font-semibold mt-15 mb-10'>
                <div className='h-35 w-full'>
                    <img src={VoidFull} className='h-full w-full object-cover' alt="" />
                </div>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-80'>
                <div className='flex gap-2'>
                    <input value={firstName} onChange={(e)=>setfirstName(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded w-full px-3 py-2' placeholder='first name' type="text" />
                    <input value={lastName} onChange={(e)=>setlastName(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded w-full px-3 py-2' placeholder='last name' type="text" />
                </div>
                <input value={username} onChange={(e)=>setUsername(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded px-3 py-2' placeholder='username' type="text" />
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded px-3 py-2' placeholder='email' type="text" />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} className='bg-[#181A20] focus:outline-none text-white placeholder:text-[#808191] rounded px-3 py-2' placeholder='password' type="text" />
                <button type='submit' className='w-80 rounded-xl font-semibold px-8 py-3 hover:bg-[#4F3ECA] bg-[#6B5DD3] text-white mt-10'>Register</button>
            </form>
            <div className='flex gap-2 w-full text-[#808191] justify-center border-t-2 border-[#373A43] py-3 mt-auto'>
                <h1>Already have an account?</h1>
                <Link to='/login' className=' font-semibold text-white'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Register
