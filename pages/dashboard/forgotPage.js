import React, { useState } from 'react'
import DashboardLayout from '../../containers/DashboardLayout/DashboardLayout'
import { TextField } from '@mui/material'
import { Button } from 'antd'
import { API, graphqlOperation, Amplify } from "aws-amplify";
import { optCode , updatepassword} from '../../src/graphql/mutations';
import attendance from '../../assets/Picture1.png'
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
export default function forgotPage() {
    const [Visibility,setVisibility]=useState(false)
    const [passVisiblility,SetpassVisiblility]=useState(false)
    const [rollNumber,setRollNumber]=useState("")
    const [user,setUser]=useState({
      OTP:0,
      EnteredOTP:0,
      newPass:"",
      error:""
    })
    const getOTP=async()=>{
      if(!rollNumber.toUpperCase().includes('F-')){
        setUser({...user,error:"Roll no format is not correct write like 19F-"})
        return 
      }
      const variables={
        data:{
          rollNumber:rollNumber
        }
      }
      await API.graphql(graphqlOperation(optCode,variables)).then((result)=>{
        alert('Check OTP')
        console.log(result)
        setVisibility(true)
        setUser({...user,OTP:result.data.getOtpCode.optCode})
      }).catch((error)=>{
        alert("Account doesnt exist")
      })
    }
    const checkOTP=()=>{
      if(user.OTP===user.EnteredOTP){
        SetpassVisiblility(true)
      }
    }
    const inputHandler=()=>{
      const { name, value } = event.target;
      setUser({...user,[name]:value})
    }
    const updatePassword=async()=>{
      const variables={
        data:{
          rollNumber:rollNumber,
          user:{
            password:user.newPass
          }
        }
      }
      console.log(variables)
      await API.graphql(graphqlOperation(updatepassword,variables)).then((result)=>{
        alert("password updated")
        Router.push('/')
        console.log(result)

      }).catch(()=>{
        setUser({...user,error:"Roll no format is not correct write like 19F-"})
      })
    }
  return (
    <>
       <div className="flex flex-row items-center mt-2 justify-start pb-4 px-4 overflow-hidden">
        <Link href='/'>
       <Image
            src={attendance}
            width={70}
            height={70}
            className="flex-1 object-fit"
            />
            </Link>
          <h1 className="ml-[32%] font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
          Find your account
          </h1>
        </div>
           <div className="flex flex-col justify-center items-center py-6 w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
           <p className="text-red-600">{user.error}</p>
            <div className='flex flex-row items-center space-x-4'>
            <TextField  id="outlined-basic" label="Search for your account" variant="outlined" onChange={(event)=>setRollNumber(event.target.value)}/>
            <Button onClick={getOTP}>Search</Button>
            </div>
            {Visibility&&<div className='flex flex-row items-center mt-4 space-x-4'>
            <TextField  id="outlined-basic" label="Enter OTP" name='EnteredOTP' type={'number'} variant="outlined" onChange={inputHandler}/>
            <Button onClick={checkOTP}>Send</Button>
            </div>
             } 
            {passVisiblility&&<div className='flex flex-row items-center mt-4 space-x-4'>
            <TextField  id="outlined-basic" label="Enter your new password" name='newPass' type={'text'} variant="outlined" onChange={inputHandler}/>
            <Button onClick={updatePassword}>Update</Button>
            </div>
             } 
           </div>
    </>
  )
}
