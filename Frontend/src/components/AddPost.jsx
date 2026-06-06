import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AddPost = () => {

    const [user, setUser] = useState(null);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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

        const formData = new FormData();
        
        formData.append("caption", caption);
        formData.append("image", image);

        axios.post('http://localhost:3000/api/post/create',
            formData,
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
                <div className='flex items-center gap-5'>
                    <label className='rounded overflow-hidden w-fit px-3 py-1 text-xl border-2'>
                        <i class="ri-image-add-line"></i>
                        <input onChange={(e)=>
                            {
                                const file = e.target.files[0]
                                setImage(file);

                                if(file){
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }
                        } className='hidden' type="file" accept="image/*" />
                    </label>
                    {
                        imagePreview && (
                            <div className='flex justify-center h-10'>
                                <img 
                                    src={imagePreview}
                                    alt="Preview" 
                                    className='rounded overflow-hidden w-full h-full'
                                />
                            </div>
                        )
                    }
                </div>
                <button type='submit' className='border px-3 py-1 rounded border-2'>Post</button>
            </div>
        </form>
    </div>
  )
}

export default AddPost
