import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {socket} from '../utils/socket'

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
        axios.post('http://localhost:3000/api/auth/login',
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
            console.log(res.data)
        })
        .catch((err)=>{
            if(err.response?.status === 409){
              alert("Username already exists");
            }
            console.log(err)
        })
        console.log(userDetails)
    }

  return (
    <div className='h-screen flex justify-center py-10'>
        <div className='h-full rounded w-120 border flex flex-col items-center px-10 py-5 gap-10'>
            <div className='text-3xl font-semibold mt-25 mb-10'>
                <h1>Platform Name</h1>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-80'>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className='border rounded px-3 py-2' placeholder='email' type="text" />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} className='border rounded px-3 py-2' placeholder='password' type="text" />
                <button type='submit' className='w-80 px-3 py-2 font-semibold border rounded mt-10'>Login</button>
            </form>
            <div className='flex gap-2 w-full justify-center border-t py-3 mt-auto'>
                <h1>Don't have an account?</h1>
                <Link to='/register' className='font-semibold'>Register</Link>
            </div>
        </div>
    </div>
  )
}

export default Login
