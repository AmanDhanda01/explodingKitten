import React, { useState } from 'react'
import { createUser } from '../api/api';

export default function EnterUser({setUsername}){
    const [input,setInput] = useState(null);
  return (
    <div className='min-h-screen min-w-screen bg-black flex justify-center items-center'>
           <form className='flex flex-col space-y-5 border boreder-white h-[20] rounded-lg p-4' onSubmit={() =>{
                             setUsername(input)
                             createUser(input,0);
           }}>
                 <h1 className='text-lg text-green-500 font-semibold text-center'>Explodding Kitten</h1>
                <input type="text" className='flex-1 h-h-[80%] outline-none p-2' onChange={(e) =>{
                        setInput(e.target.value)
                }} placeholder='Enter your Username'/>
                <button className='rounded-lg bg-green-500 text-white'>Submit</button>
           </form>
    </div>
  )
}


