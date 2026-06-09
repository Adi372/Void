import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const AllFriends = () => {

    const [friends, setFriends] = useState([]);

    useEffect(()=>{
        axios.get('http://localhost:3000/api/user/allFriends',
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setFriends(res.data.friends);
        })
        .catch((err)=>{
            console.log(err);
        })
    }, []);

    function removeFriend(user2Id){
        axios.post('http://localhost:3000/api/user/removeFriend',
            {user2Id},
            {withCredentials: true}
        )
        .then((res)=>{
            console.log(res.data);
            setFriends(prev =>
                prev.filter(friend => friend._id !== user2Id)
            );
        })
        .catch((err)=>{
            console.log(err);
        })
    }

  return (
    <div className='h-screen flex flex-col'>
        <div className=' font-semibold text-white text-4xl p-6 flex justify-between'>
            Friends
        </div>
        <div className=' h-full overflow-y-auto hide-scrollbar px-4 py-6'>
            {
                friends.map((f)=>(
                    <div key={f._id} className='border-b border-[#373A43] px-4 py-4 w-full flex items-center justify-between'>

                        <Link to={`/userProfile/${f._id}`} className='flex gap-4'>
                            <div className="text-white h-15 w-15 rounded-full overflow-hidden cursor-pointer">
                                {!f?.profilePic ? (
                                <div className="h-full w-full flex items-center justify-center text-2xl">
                                    <i className="ri-user-line"></i>
                                </div>
                                ) : (
                                <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                                    <img
                                        src={f.profilePic}
                                        alt="Profile Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                )}
                            </div>
                            <div className='flex flex-col justify-center text-white'>
                                <h1 className='font-semibold text-xl'>{f.username}</h1>
                                <h1 className='text-sm'>{f.fullName.firstName} {f.fullName.lastName}</h1>
                            </div>
                        </Link>
                        <button onClick={(()=>removeFriend(f._id))} className='cursor-pointer bg-[#D97A7A] hover:bg-[#C76666] rounded-2xl text-white w-fit py-3 px-5 font-semibold'>
                            <h1>Remove</h1>
                        </button>

                    </div>
                    
                ))
            }  
        </div>
    </div>
  )
}

export default AllFriends
