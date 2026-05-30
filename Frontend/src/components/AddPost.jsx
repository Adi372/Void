import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AddPost = () => {

    const [user, setUser] = useState(null);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:3000/api/auth/findUser',
            {
                withCredentials: true
            }
        )
        .then((res)=>{
            setUser(res.data);
        })
        .catch((err)=>{
            console.log(err);
            setUser(null);
        });
    }, []);

    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.post('http://localhost:3000/api/post/create',
            {
                caption
            },
            {withCredentials: true}
        )
        .then((res)=>{
            navigate('/profile');
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    if(!user){
        return <div className='h-full flex justify-center items-center font-semibold text-4xl'>Loading...</div>
    }

  return (
    <div className='h-screen flex justify-center items-center'>
        <form onSubmit={handleSubmit} className='border h-fit w-150 rounded flex flex-col p-5 overflow-hidden gap-5'>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='hide-scrollbar border px-5 py-3 rounded h-100 w-full resize-none' placeholder="What's on your mood" type="text" />
            <div className='flex justify-between items-center'>
                <div>
                    <label className='rounded overflow-hidden w-fit px-3 py-1 text-xl border-2'>
                        <i class="ri-image-add-line"></i>
                        <input className='hidden' type="file" accept="image/*" />
                    </label>
                </div>
                <button type='submit' className='border px-3 py-1 rounded border-2'>Post</button>
            </div>
        </form>
    </div>
  )
}

export default AddPost
