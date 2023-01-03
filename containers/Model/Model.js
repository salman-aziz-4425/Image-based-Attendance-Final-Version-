import React, { useState } from 'react'
import { Modal,Box,Typography } from '@mui/material'
import {Button } from 'antd';
import Image from "next/image";
import Input from "antd/lib/input/Input";
import { FormControl,InputLabel,FormHelperText } from '@mui/material';
import Dropdown from '../../UI/Dropdown/Dropdown'
export default function Model({open,setOpen,User1}) {
  console.log(User1)
    const handleOpen=()=>{
        setOpen(!open)
    }
    const [type, setType] = useState("");
    const [error,setError]=useState({
      Email:"",
      Name:"",
      type:"",
      PhoneNo:0,
      Address:"",
      RollNo:"",
      Qualification:''
    })
    const [User,setUser]=useState({
      Name:"",
      Email:"",
      PhoneNo:0
    })
    const [typeAttributes,setAttributes]=useState({
      RollNo:"",
      Qualification:"",
      Address:""
    })
    const inputHandler=(event)=>{
      const { name, value } = event.target;
      console.log(name)
      setUser({ ...User, [name]: value });
      console.log(User)
        setAttributes({...typeAttributes,[name]:value})
    }
  return (
    <>
    <Modal
      open={open}
      onClose={handleOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="justify-center pl-[10%] pt-[3%]"
    >
        <div className="w-5/6 h-5/6 my-5 mx-10 bg-white font-extrabold align-middle justify-center rounded-md shadow-2xl overflow-hidden">
        <div className="flex pt-5 pb-0 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            {" "}
            Update User
          </h1>
        </div>
        <div className="flex flex-row items-center w-full px-8 space-x-2 overflow-hidden bg-red">
          <div className="flex-1 flex flex-col w-[44%] justify-start items-center">
           <p className="text-red-600">{error.Name}</p>
            <Input className="my-2 " name="Name"  placeholder="Student Name" onChange={inputHandler}></Input>
            <p className="text-red-600">{error.Email!==""&&error.Email}</p>
            <Input className="my-2 " placeholder="Student Email" name="Email" onChange={inputHandler}></Input>
            <p className="text-red-600">{error.PhoneNo!==0&&error.PhoneNo}</p>
            <Input
              className="my-2 "
              type="number"
              placeholder="Student Phone No"
              name="PhoneNo"
              onChange={inputHandler}
            ></Input>
          </div>
          <div className="my-2 w-[44%]">
            <Image
              src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2250&q=80"
              alt="Image"
              width={200}
              height={160}
              priority
              className="object-contain"
            />
             
          </div>
        </div>
        <div  className="flex px-[26px] space-x-2 flex-wrap justify-left">
          <Input className="my-2 w-[49%] " type="file"></Input>
          <div  className="flex flex-col items-center my-2 w-[49%]">
          <p className="text-red-600 align-middle">{error.type}</p>
          <Dropdown setType={setType}/>
          </div>
          <div>
    </div>
      {
        type==="Student"?
        <>
        <div  className="flex flex-col my-1 w-[49%]">
<Input  name="RollNo"  placeholder="Roll no" ></Input>
<p className="text-red-600 align-middle">{error.RollNo}</p>
</div>
<div className="flex flex-col my-1 w-[49%]">
<Input  name="Qualification" placeholder="Qualification" ></Input>
<p className="text-red-600 align-middle">{error.Qualification}</p>
</div>
</>:type==="Teacher"&&<>
<div  className="flex flex-col my-1 w-[49%]">
<Input  name="Address"  placeholder="Address" ></Input>
<p className="text-red-600 align-middle">{error.Address}</p>
</div>
<div className="flex flex-col my-1 w-[49%]">
<Input  name="Qualification" placeholder="Qualification" ></Input>
<p className="text-red-600 align-middle">{error.Qualification}</p>
</div>

</>
      }
         
          <Button >Update</Button>

          </div>
      </div>
    </Modal>
    </>
  )
}
