import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {socket} from '../utils/socket'

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
            navigate('/profile')
        })
        .catch((err)=>{
            if(err.response?.status === 409){
              alert("Username already exists");
            }
            console.log(err)
        })
        console.log(userDetails);
    }

  return (
    <div className='h-screen flex justify-center py-10'>
        <div className='h-full rounded w-120 border flex flex-col items-center px-10 py-5 gap-10'>
            <div className='text-3xl font-semibold mt-25 mb-10'>
                <h1>Platform Name</h1>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-80'>
                <div className='flex gap-2'>
                    <input value={firstName} onChange={(e)=>setfirstName(e.target.value)} className='border w-full rounded px-3 py-2' placeholder='first name' type="text" />
                    <input value={lastName} onChange={(e)=>setlastName(e.target.value)} className='border w-full rounded px-3 py-2' placeholder='last name' type="text" />
                </div>
                <input value={username} onChange={(e)=>setUsername(e.target.value)} className='border rounded px-3 py-2' placeholder='username' type="text" />
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className='border rounded px-3 py-2' placeholder='email' type="text" />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} className='border rounded px-3 py-2' placeholder='password' type="text" />
                <button type='submit' className='w-80 px-3 py-2 font-semibold border rounded mt-10'>Register</button>
            </form>
            <div className='flex gap-2 w-full justify-center border-t py-3 mt-auto'>
                <h1>Already have an account?</h1>
                <Link to='/login' className=' font-semibold'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Register
