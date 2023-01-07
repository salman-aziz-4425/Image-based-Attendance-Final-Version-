import React, { useEffect, useState } from "react";
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import Input from "antd/lib/input/Input";
import Image from "next/image";
import { getS3Url } from "../../src/graphql/queries";
import { createUser } from "../../src/graphql/mutations";

import { Button } from "antd";
import Dropdown from "../../UI/Dropdown/Dropdown";
import { API, graphqlOperation, Amplify } from "aws-amplify";
import validation from "./validation";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { tokenAuth } from "../../redux/userlogin/userSlice";
import UploadImage from "../../components/utility/imageUploading";
export default function AddProfile() {
  const dispatch = useDispatch();
  let token = useSelector((state) => state.userReducer.token);
  Amplify.configure({
    API: {
      graphql_headers: async () => ({
        token: token,
      }),
    },
  });
  const [images, setImages] = React.useState([]);
  const [type, setType] = useState("");
  const [error, setError] = useState({
    Email: "",
    Name: "",
    type: "",
    password: "",
    PhoneNo: 0,
    Address: "",
    RollNo: "",
    Qualification: "",
    image:""
  });
  const [User, setUser] = useState({
    Name: "",
    Email: "",
    PhoneNo: 0,
    password: "",
  });
  const [typeAttributes, setAttributes] = useState({
    RollNo: "",
    Qualification: "",
    Address: "",
  });
  useEffect(async ()=>{
    const Data=JSON.parse(localStorage.getItem('Token'))
    if(Data.Auth===false){
      Router.push('/')
    }
    else{
      dispatch(tokenAuth( {
        token:Data.token,
        name:Data.name,
        email:Data.email,
        image:Data.image,
        qualification:Data.qualification,
        rollNumber:Data.rollNumber,
        Auth:true
      }));
    }})
  useEffect(() => {
    setError({
      Email: "",
      Name: "",
      type: "",
      PhoneNo: 0,
      Address: "",
      RollNo: "",
      Qualification: "",
    });
  }, [type]);
  const storeImageToS3Bucket = async () =>{
    if(images === undefined||images.length<1){
      alert('no pic image')
      setError({...error,image:"Kindly upload your picture"});
      return
    }
    console.log("Image List => ",images[0]?.data_url);
    const image = images[0]?.file;
    //  Get Secure URL from our server
    const res = await API.graphql(graphqlOperation(getS3Url))
    //  Post the image directly to S3 bucket
    console.log("Res => ",res)
    const s3obj  = res.data.getS3Url;
    console.log("Url :- ",s3obj)
    await fetch(s3obj?.s3Url, {
      method: "PUT",
      headers: {
        "ContentType": "multipart/form-data"
      },
      body: image
    }).then(res=>{
      console.log("Bucket Res ",res , " s3obj ",s3obj?.key);
    }).catch(err=>{
      console.log("Error => ",err)
      return undefined
    })
    return s3obj?.key;
  }
  const dataHandler = async (event) => {
    event.preventDefault();
    setAttributes({...typeAttributes,RollNo:"19F-0188"})
    const { Flag, Error } = validation(type, User, typeAttributes);
    setError(Error);
    console.log(Flag);
    if (!Flag) {
      return;
    }
    let variables;
    const imageKey = await storeImageToS3Bucket();
    console.log("Image key  "+imageKey)
    if(imageKey ===undefined){
      setError({...error,image:"Key not found"});
      return
    }
    const imageURl =  `https://user-attendance-image-test.s3.amazonaws.com/` + imageKey;
    console.log("Image Url => ", imageURl);
    if (type === "Student") {
      variables = {
        data: {
          rollNumber: typeAttributes.RollNo,
          password: User.password,
          name: User.Name,
          email: User.Email,
          phoneNo: User.PhoneNo,
          qualification: typeAttributes.Qualification,
          image: imageURl,
          userType: "student",
        }, // key is "input" based on the mutation above
      };
    } else if (type === "Teacher") {
      console.log(User);
      console.log(typeAttributes);
      variables = {
        data: {
          rollNumber: typeAttributes.RollNo,
          password: User.password,
          name: User.Name,
          email: User.Email,
          phoneNo: User.PhoneNo,
          Address: typeAttributes.Address,
          qualification: typeAttributes.Qualification,
          image: imageURl,
          userType: "teacher",
        }, // key is "input" based on the mutation above
      };
    } else {
      console.log(User);
      console.log(typeAttributes);
      variables = {
        data: {
          rollNumber: typeAttributes.RollNo,
          password: User.password,
          name: User.Name,
          email: User.Email,
          phoneNo: User.PhoneNo,
          qualification: typeAttributes.Qualification,
          image: imageURl,
          userType: "admin",
        }, // key is "input" based on the mutation above
      };
    }


    console.log(variables.data);
    await API.graphql(graphqlOperation(createUser, variables))
      .then((result) => {
        alert("Value inserted");
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
    
  };
  const inputHandler = (event) => {
    const { name, value } = event.target;
    console.log(name);
    setUser({ ...User, [name]: value });
    console.log(User);
    setAttributes({ ...typeAttributes, [name]: value });
  };
  return (
    <DashboardLayout>
      <div className="w-5/7 h-5/7 my-8 mx-10 bg-white font-extrabold align-middle rounded-md shadow-2xl overflow-hidden">
        <div className="flex pt-5 pb-0 px-4 overflow-hidden">
          <h1 className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-gray-700 to-red-700">
            {" "}
            Add User
          </h1>
        </div>
        <div className="flex flex-row items-center w-full px-8 space-x-2 overflow-hidden bg-red">
          <div className="flex-1 flex flex-col w-[44%] justify-start items-center">
            <p className="text-red-600">{error.Name}</p>
            <Input
              className="my-2 "
              name="Name"
              placeholder="Name"
              onChange={inputHandler}
            ></Input>
            <p className="text-red-600">{error.Email !== "" && error.Email}</p>
            <Input
              className="my-2 "
              placeholder="Email"
              name="Email"
              onChange={inputHandler}
            ></Input>
            <p className="text-red-600">{error.password}</p>
            <Input
              className="my-2 "
              type="password"
              placeholder="password"
              name="password"
              onChange={inputHandler}
              maxLength={11}
            ></Input>
            <p className="text-red-600">
              {error.PhoneNo !== 0 && error.PhoneNo}
            </p>
            <Input
              className="my-2 "
              type="number"
              placeholder="Phone No"
              name="PhoneNo"
              onChange={inputHandler}
              maxLength={6}
            ></Input>
          </div>
          <div className="my-2 w-[44%]">
            <UploadImage setImagesFunc={setImages}/>
            <p className="text-red-600">{error.image}</p>
          </div>
        </div>
        <div className="flex px-[26px] space-x-2 flex-wrap justify-left">
          <div className="flex flex-col items-center my-2 w-[49%]">
            <p className="text-red-600 align-middle">{error.type}</p>
            <Dropdown type={type} setType={setType} />
          </div>
          <div></div>
          {type === "Student" || type === "admin" ? (
            <>
              <Dropdown type={type} setType={setType} />
              <div className="flex flex-col my-1 w-[49%]">
                <Input
                  name="Qualification"
                  placeholder="Qualification"
                  onChange={inputHandler}
                ></Input>
                <p className="text-red-600 align-middle">
                  {error.Qualification}
                </p>
              </div>
            </>
          ) : (
            type === "Teacher" && (
              <>
                <div className="flex flex-col my-1 w-[49%]">
                  <Input
                    name="Address"
                    placeholder="Address"
                    onChange={inputHandler}
                  ></Input>
                  <p className="text-red-600 align-middle">{error.Address}</p>
                </div>
                <div className="flex flex-col my-1 w-[49%]">
                  <Input
                    name="Qualification"
                    placeholder="Qualification"
                    onChange={inputHandler}
                  ></Input>
                  <p className="text-red-600 align-middle">
                    {error.Qualification}
                  </p>
                </div>
              </>
            )
          )}

        </div>
        <Button onClick={dataHandler}>Submit</Button>

      </div>
    </DashboardLayout>
  );
}
