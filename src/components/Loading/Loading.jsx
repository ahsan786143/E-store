"use client";

import React from 'react'

const Loading = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-start mt-12 '>
       <img
           src="/assets/images/loading.svg"
           width= "80px"
           height= "80px"
           alt="loading"
           className = "max-w-[200px]"
           />
    </div>
  )
}

export default Loading
