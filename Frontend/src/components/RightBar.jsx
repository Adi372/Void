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
      console.log("Suggested Accounts: ", res.data.accountWithSimilarInterests);
      setSimilarAccounts(res.data.accountWithSimilarInterests);
    })
    .catch((err)=>{
      console.log(err);
    })
  }, []);

  return (
    <div className='h-full w-[300px] border-l flex flex-col py-5 px-10 self-end gap-5'>
        <h1 className='font-semibold text-xl'>Suggested for you</h1>
        <div className='flex flex-col gap-5'>
            {
              similarAccounts.map((a, index)=>(
                <Link key={index} to={`/userProfile/${a._id}`} className=' rounded flex items-center gap-3'>
                  <div className='border h-15 w-15 rounded-full flex justify-center items-center'>
                    <i class="ri-user-line"></i>
                  </div>
                  <div className='flex flex-col justify-center'>
                    <h1 className='font-semibold text-xl'>{a.username}</h1>
                    <h1 className='text-sm'>{a.fullName.firstName} {a.fullName.lastName}</h1>
                  </div>
                </Link>
              ))
            }
        </div>
    </div>
  )
}

export default RightBar
