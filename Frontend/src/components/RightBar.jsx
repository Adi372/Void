import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const RightBar = () => {

  const [similarAccounts, setSimilarAccounts] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:3000/api/user/similarAccounts', 
      {withCredentials: true}
    )
    .then((res)=>{
      // console.log("Suggested Accounts: ", res.data.accountWithSimilarInterests);
      setSimilarAccounts(res.data.accountWithSimilarInterests);
    })
    .catch((err)=>{
      // console.log(err);
    })
  }, []);

  return (
    <div className='h-full w-[300px] bg-[#232630] border-l-2 border-[#373A43] text-white flex flex-col py-5 px-10 self-end gap-5'>
        <h1 className='font-semibold text-xl mb-5'>Suggested for you</h1>
        <div className='flex flex-col gap-5'>
            {
              similarAccounts.map((a, index)=>(
                <div className='flex gap-5 items-center'>
                  <Link to={`/userProfile/${a._id}`} className=" h-14.5 w-14.5 rounded-full overflow-hidden cursor-pointer">
                      {!a?.profilePic ? (
                      <div className="hover:text-white text-[#808191] h-full w-full flex items-center justify-center text-2xl">
                          <i className="ri-user-line"></i>
                      </div>
                      ) : (
                      <div className="hover:border-white hover:border-2 h-full w-full rounded-full flex items-center justify-center overflow-hidden text-xl">
                          <img
                              src={a.profilePic}
                              alt="Profile Preview"
                              className="h-full w-full object-cover"
                          />
                      </div>
                      )}
                  </Link>

                  <Link to={`/userProfile/${a._id}`} className='hover:text-white flex flex-col justify-center text-[#808191]'>
                    <h1 className='font-semibold text-xl'>{a.username}</h1>
                    <h1 className='text-sm'>{a.fullName.firstName} {a.fullName.lastName}</h1>
                  </Link>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default RightBar
