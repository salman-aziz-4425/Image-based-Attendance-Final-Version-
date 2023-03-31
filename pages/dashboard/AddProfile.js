import React, { useEffect, useState } from "react";
import DashboardLayout from "../../containers/DashboardLayout/DashboardLayout";
import Input from "antd/lib/input/Input";
import Image from "next/image";
import { getS3Url } from "../../src/graphql/queries";
import { createUser } from "../../src/graphql/mutations";
import { Button,message } from "antd";
import Dropdown from "../../UI/Dropdown/Dropdown";
import { API, graphqlOperation, Amplify } from "aws-amplify";
import validation from "./validation";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { tokenAuth } from "../../redux/userlogin/userSlice";
import UploadImage from "../../components/utility/imageUploading";
import { types, batches } from "../../UI/Dropdown/flowDropdown";
import { analyzeImage } from "../../src/graphql/queries";
import image from "next/image";
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
  const [batch, setbatch] = useState("");
  const [error, setError] = useState({
    RollNo:"",
    Email: "",
    Name: "",
    type: "",
    password: "",
    PhoneNo: 0,
    Address: "",
    RollNo: "",
    Qualification: "",
    image: "",
    batch: "",
  });
  const [User, setUser] = useState({
    RollNo: "",
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
  useEffect(async () => {
    const Data =
      localStorage.getItem("Token") &&
      JSON.parse(localStorage.getItem("Token"));
    if (Data?.Auth === false || !localStorage.getItem("Token")) {
      Router.push("/");
    } else {
      if(Data?.rollNumber.includes("TD-")===true){
        Router.push("/dashboard/GroupImage");
      }
      dispatch(
        tokenAuth({
          id: Data?.id,
          token: Data?.token,
          name: Data?.name,
          email: Data?.email,
          image: Data?.image,
          qualification: Data?.qualification,
          rollNumber: Data?.rollNumber,
          Auth: true,
        })
      );
    }
  },[]);
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
  const storeImageToS3Bucket = async () => {
    if (images === undefined || images.length < 1) {
      alert("no pic image");
      setError({ ...error, image: "Kindly upload your picture" });
      return;
    }
    console.log("Image List => ", images[0]?.data_url);
    const image = images[0]?.file;
    //  Get Secure URL from our server
    const res = await API.graphql(graphqlOperation(getS3Url));
    //  Post the image directly to S3 bucket
    console.log("Res => ", res);
    const s3obj = res.data.getS3Url;
    console.log("Url :- ", s3obj);
    await fetch(s3obj?.s3Url, {
      method: "PUT",
      headers: {
        ContentType: "multipart/form-data",
      },
      body: image,
    })
      .then((res) => {
        console.log("Bucket Res ", res, " s3obj ", s3obj?.key);
      })
      .catch((err) => {
        console.log("Error => ", err);
        return undefined;
      });
    return s3obj?.key;
  };
  const dataHandler = async (event) => {
    message.loading("Checking Credentials")
    event.preventDefault();
    const { Flag, Error } = validation(type, User, typeAttributes, batch);
    setError(Error);
    console.log(Error)
    console.log(Flag);
    if (!Flag) {
      message.error("Something went wrong")
      return;
    }
    let variables;
    const imageKey = await storeImageToS3Bucket();
    console.log("Image key  " + imageKey);

    if (imageKey === undefined) {
      setError({ ...error, image: "Key not found" });
      return;
    }
    const variable1={
        rollNumber:"19F-0295",
        imageS3Key:imageKey
    }
    console.log(variable1)
    try{
      const response= await API.graphql(graphqlOperation(analyzeImage,variable1))
      if(!response.data?.analyzeImage?.faceConf){
        throw new Error
      }
    }catch{
      setError({...error,image:"In picture it is not a human"})
      return
    }
    const imageURl =
      `https://user-attendance-image-test.s3.amazonaws.com/` + imageKey;
    console.log("Image Url => ", imageURl);

    if (type === "Student") {
      variables = {
        data: {
          rollNumber: batch+"F-"+ User.RollNo,
          password: User.password,
          name: User.Name,
          email: User.Email,
          phoneNo: User.PhoneNo,
          address: typeAttributes.Address,
          qualification: typeAttributes.Qualification,
          imageS3Key:imageKey,
          image: imageURl,
          userType: "student",
        }, // key is "input" based on the mutation above
      };
    } else if (type === "Teacher") {
      variables = {
        data: {
          rollNumber: "TD-" + User.RollNo,
          password: User.password,
          name: User.Name,
          email: User.Email,
          phoneNo: User.PhoneNo,
          address: typeAttributes.Address,
          qualification: typeAttributes.Qualification,
          imageS3Key:imageKey,
          image: imageURl,
          userType: "teacher",
        }, // key is "input" based on the mutation above
      };
    } else {
      variables = {
        data: {
          rollNumber: "AD-" + User.RollNo,
          password: User.password,
          name: User.Name,
          email: User.Email,
          phoneNo: User.PhoneNo,
          address: typeAttributes.Address,
          qualification: typeAttributes.Qualification,
          imageS3Key:imageKey,
          image: imageURl,
          userType: "admin",
        }, // key is "input" based on the mutation above
      };
    }
    console.log(variables.data);
    await API.graphql(graphqlOperation(createUser, variables))
      .then((result) => {
        message.success("You Credentials Recorded")
      })
      .catch((error) => {
        console.log(error);
        message.error("Something went wrong")
      });
  };
  const inputHandler = (event) => {
    const { name, value } = event.target;
    setUser({ ...User, [name]: value });
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
            <p className="text-red-600">{error.RollNo !== "" && error.RollNo}</p>
            <Input
              className="my-2 "
              name="RollNo"
              type="number"
              placeholder="Roll no"
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
              max={16}
              maxLength={16}
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
              max={11}
              maxLength={11}
            ></Input>
            <p className="text-red-600 align-middle">{error.Qualification}</p>
            <Input
              className="my-2 "
              name="Qualification"
              placeholder="Qualification"
              onChange={inputHandler}
            ></Input>
            <p className="text-red-600 align-middle">{error.Address}</p>
            <Input
              className="my-2 "
              name="Address"
              placeholder="Address"
              max={60}
              maxLength={60}
              onChange={inputHandler}
            ></Input>
          </div>
          <div className="my-2 w-[44%]">
            <UploadImage setImagesFunc={setImages} />
            <p className="text-red-600">{error.image}</p>
          </div>
        </div>
        <div className="flex px-[26px] space-x-6 items-center flex-wrap justify-left  w-[49%]">
          <div className="flex flex-col items-center my-2">
            <p className="text-red-600 align-middle">{error.type}</p>
            <Dropdown
              type={type}
              setType={setType}
              activeTypes={types}
              title="TYPE"
            />
          </div>
          <>
            {type === "Student" && (
              <div>
                <p className="text-red-600 align-middle">{error.batch}</p>
                <Dropdown
                  type={batch}
                  setType={setbatch}
                  activeTypes={batches}
                  title="BATCH"
                />
              </div>
            )}
          </>
          <Button onClick={dataHandler}>Submit</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
