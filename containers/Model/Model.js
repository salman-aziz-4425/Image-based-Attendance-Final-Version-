import React, { useState } from 'react'
import { Modal,Box,Typography } from '@mui/material'
import {Button } from 'antd';
import Image from "next/image";
import Input from "antd/lib/input/Input";
import { useSelector, useDispatch } from 'react-redux'
import Dropdown from '../../UI/Dropdown/Dropdown'
import {API,graphqlOperation} from 'aws-amplify';
import { updateUser } from '../../src/graphql/mutations';
import UploadImage from "../../components/utility/imageUploading";
import {getS3Url} from '../../src/graphql/queries'
import validation from './Validation'
import { tokenAuth } from '../../redux/userlogin/userSlice';
export default function Model({open,setOpen,User1,AllUsers,setUser}) {
  const token = useSelector((state)=>state.userReducer.token);
  const dispatch=useDispatch()
    const handleOpen=()=>{
        setOpen(!open)
    }
    const [type, setType] = useState(User1.userType);
    const [images, setImages] = React.useState([]);
    const [error,setError]=useState({
      Email:"",
      Name:"",
      type:"",
      PhoneNo:0,
      Address:"",
      RollNo:"",
      Qualification:""
    })
    const [User2,setUser2]=useState({
      Name:"",
      Email:"",
      PhoneNo:0,
      Qualification:"*",
      userType:""
    })
    const inputHandler=(event)=>{
      const { name, value } = event.target;
      setUser2({ ...User2, [name]: value });
    }
    const storeImageToS3Bucket = async () =>{
      if(images === undefined||images.length<1){
        setError({...error,image:"Kindly upload your picture"});
        return
      }

      const image = images[0]?.file;
      //  Get Secure URL from our server
      const res = await API.graphql(graphqlOperation(getS3Url))
      //  Post the image directly to S3 bucket
  
      const s3obj  = res.data.getS3Url;
    
      await fetch(s3obj?.s3Url, {
        method: "PUT",
        headers: {
          "ContentType": "multipart/form-data"
        },
        body: image
      }).then(res=>{
       
      }).catch(err=>{
        return undefined
      })
      return s3obj?.key;
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
            <Input className="my-2 " name="Name"  placeholder="Name" onChange={inputHandler}></Input>
            <p className="text-red-600">{error.Email!==""&&error.Email}</p>
            <Input className="my-2 " placeholder="Email" name="Email" onChange={inputHandler} ></Input>
            <p className="text-red-600">{error.PhoneNo!==0&&error.PhoneNo}</p>
            <Input
              className="my-2 "
              type="number"
              placeholder="Phone No"
              name="PhoneNo"
              onChange={inputHandler}
            ></Input>
          </div>
          <div className="my-2 w-[44%]">
            <UploadImage setImagesFunc={setImages}/>
          </div>
        </div>
        <div  className="flex px-[26px] space-x-2 flex-wrap justify-left">
          <div className="my-2 w-[49%] "></div>
          <div  className="flex flex-col items-center my-2 w-[49%]">
          <p className="text-red-600 align-middle">{error.type}</p>
          <Dropdown type={type} setType={setType}/>
          </div>
          <div>
    </div>
<div className="flex flex-col my-1 w-[49%]">
<Input  name="Qualification" placeholder="Qualification" onChange={inputHandler}></Input>
<p className="text-red-600 align-middle">{error.Qualification}</p>
</div>
          <Button onClick={async (event)=>{
            event.preventDefault()
            const index=AllUsers.findIndex((object)=>{
              return object.id===User1.id
            })
            const valid=validation(type,User2,User1)
            const imageKey = await storeImageToS3Bucket();
            const imageURl =  `https://user-attendance-image-test.s3.amazonaws.com/` + imageKey;
            console.log(imageURl)
            if(imageURl.length===undefined){
              imageURl=User1.image
            }
            setError(valid.Error)
            if(valid.Flag===false){
              return
            }
            else{
              if(valid.User.userType===undefined||valid.User.userType.length===0){
                valid.User.userType=User1.userType
              }
              AllUsers[index].name=valid.User.Name
              AllUsers[index].email=valid.User.Email
              AllUsers[index].userType=valid.User.userType.toLowerCase()
              AllUsers[index].qualification=valid.User.Qualification
              AllUsers[index].image=imageURl
              console.log(valid.User)
            }
            const variables = {
              data:{
                rollNumber:User1.rollNumber,
                user:{
                  name:valid.User.Name,
                  email:valid.User.Email,
                  qualification:valid.User.Qualification,
                  image:imageURl,
                  userType:valid.User.userType.toLowerCase()
                },
              }
           };
           console.log(variables)
            await API.graphql(graphqlOperation(updateUser,variables)).then((result)=>{
              console.log("response data")
              console.log(result.data.updateUser.id)
              if(result.data.updateUser.id===User1.id){
                dispatch(tokenAuth( {
                  token:token,
                  name:result.data.updateUser.name,
                  email:result.data.updateUser.email,
                  image:result.data.updateUser.image,
                  qualification:result.data.updateUser.qualification,
                  rollNumber:result.data.updateUser.rollNumber,
                  Auth:true
                }))
                localStorage.setItem("Token",JSON.stringify({
                  token:token,
                  name:result.data.updateUser.name,
                  email:result.data.updateUser.email,
                  image:result.data.updateUser.image,
                  qualification:result.data.updateUser.qualification,
                  rollNumber:result.data.updateUser.rollNumber,
                  Auth:true
                }));
              }
              setUser(AllUsers)
              alert("Updated")
            }).catch((error)=>{
              console.log(error)
            })
          }}>Update</Button>

          </div>
      </div>
    </Modal>
    </>
  )
}