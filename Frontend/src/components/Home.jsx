import React from 'react'
import Feed from './Feed'
import Search from './Search'

const Home = () => {
  return (
    <div className='h-screen items-center py-5 overflow-y-auto hide-scrollbar flex flex-col gap-5'>
        <Search/>
        <Feed/>
        <Feed/>
        <Feed/>
    </div>
  )
}

export default Home
