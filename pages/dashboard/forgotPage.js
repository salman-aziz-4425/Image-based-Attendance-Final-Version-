import React, { useState } from 'react'
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout'
import { TextField } from '@mui/material'
import { Button } from 'antd'
export default function forgotPage() {
    const [Visibility,setVisibility]=useState(false)
    const [password,setpassword]=useState(false)
  return (
    <DashboardLayout>
           <div className="flex flex-col justify-center items-center py-6 w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
           <div className="flex pb-4 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
          Find your account
          </h1>
        </div>
            <div className='flex flex-row items-center space-x-4'>
            <TextField  id="outlined-basic" label="Search for your account" variant="outlined" />
            <Button>Search</Button>
            </div>
            {Visibility&&<div className='flex flex-row items-center mt-4 space-x-4'>
            <TextField  id="outlined-basic" label="Enter OTP" type={'number'} variant="outlined" />
            <Button>Search</Button>
            </div>
             } 
            {password&&<div className='flex flex-row items-center mt-4 space-x-4'>
            <TextField  id="outlined-basic" label="Enter your new password" type={'text'} variant="outlined" />
            <Button>submit</Button>
            </div>
             } 
           </div>
    </DashboardLayout>
  )
}
