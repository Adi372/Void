import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Interests = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const categories = [
        
        "Technology","Music","Sports","Gaming","Travel",
        "Movies & TV","Fitness","Photography","Food",
        "Fashion","Art & Design","Business","Education",
        "Science","Books","Lifestyle","Creators","Anime",
        "Memes","News"
    ]

    const [chosen, setChosen] = useState([]);

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

    function updateInterests(interests){
        axios.post('http://localhost:3000/api/user/updateInterests',
            {interests},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
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
    <div className='h-screen flex flex-col'>
        <div className=' text-4xl py-10 px-6 flex items-center justify-center'>
            Choose Your Interests
        </div>
        <div className=' flex justify-center px-20 py-20'>
            <div className='h-fit w-200 justify-center flex flex-wrap contents-start gap-2'>
                {
                    categories.map((cat, index) => (
                        <div onClick={() => {
                                setChosen(prev =>
                                    prev.includes(cat)
                                        ? prev.filter(i => i !== cat)
                                        : [...prev, cat]
                                );
                            }} 
                            key={index} className={`${chosen.includes(cat)? "border-red-500":"border-black"} border text-xl w-fit h-fit px-8 py-4 flex rounded items-center justify-center`}>
                            {cat}
                        </div>
                    ))
                }
            </div>
        </div>
        <button onClick={(()=>updateInterests(chosen))} className='border flex items-center justify-center self-center text-3xl w-15 h-15 rounded-full'><i class="ri-arrow-right-line"></i></button>
    </div>
  )
}

export default Interests
