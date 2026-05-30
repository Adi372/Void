import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'

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
      console.log(res.data);
    })
    .catch((err)=>{
      console.log(err);
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
        <div className='border relative'>
          <input value={name} onChange={(e)=>{setName(e.target.value)}} className='border rounded w-140 py-2 px-3' placeholder='Search...' type="text" />
          <div className='px-2 bg-zinc-300 overflow-x-hidden overflow-y-auto hide-scrollbar absolute border h-fit w-full max-h-100 flex flex-col'>
            {
              result.map((r)=>(
                <div className='my-1 flex items-center gap-3'>
                  <div className='self-start h-10 w-10 border rounded-full flex justify-center items-center'>
                      <i class="ri-user-line"></i>
                  </div>
                  <div className='flex flex-col items-center text-sm'>
                      <h1 className='break-all font-semibold'>{r.username}</h1>
                      <h1 className='break-all'>{r.fullName.firstName} {r.fullName.lastName}</h1>
                  </div>
              </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Search
