import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Search = () => {

  const [name, setName] = useState('')
  const [result, setResult] = useState([]);
  
  function searchProfile(name){
    axios.post('http://localhost:3000/api/user/searchUser', 
      {name},
      {withCredentials: true}
    )
    .then((res)=>{
      setResult(res.data);
      // console.log("Search Results: ", res.data);
    })
    .catch((err)=>{
      // console.log(err);
    })
  }

  useEffect(()=>{
    if (!name.trim()) {
      setResult([]);
      return;
    }
    searchProfile(name);
  },[name]);

  return (
    <div className='sticky w-full top-0 z-10 flex items-center justify-center'>
        <div className='bg-transparent rounded relative'>
          <input value={name} onChange={(e)=>{setName(e.target.value)}} className='focus:outline-none text-white placeholder:text-[#808191] rounded w-140 py-2 px-3' placeholder='Search...' type="text" />
          <div className={` ${result?.length > 0 ? "flex" : "hidden"} px-2 bg-black/50 shadow-[0_12px_30px_rgba(0,0,0,0.35)] rounded-b-4xl text-white overflow-x-hidden overflow-y-auto hide-scrollbar absolute h-fit w-full max-h-100 flex flex-col`}>
            {
              result.map((r)=>(
                <div className='hover:bg-white/20 rounded-4xl p-1 my-2 flex items-center gap-3'>
                  <Link to={`/userProfile/${r._id}`} className=" h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                      {!r?.profilePic ? (
                      <div className="h-full w-full flex items-center justify-center text-2xl">
                          <i className="ri-user-line"></i>
                      </div>
                      ) : (
                      <div className=" h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                          <img
                              src={r.profilePic}
                              alt="Profile Preview"
                              className="h-full w-full object-cover"
                          />
                      </div>
                      )}
                  </Link>
                  <Link to={`/userProfile/${r._id}`} className='flex flex-col justify-center text-sm'>
                      <h1 className='break-all font-semibold'>{r.username}</h1>
                      <h1 className='break-all'>{r.fullName.firstName} {r.fullName.lastName}</h1>
                  </Link>
              </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Search
